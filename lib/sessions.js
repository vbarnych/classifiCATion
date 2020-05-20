'use strict';

const crypto = require('crypto');
const TOKEN = 'token';
const TOKEN_LENGTH = 60;
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const LOCATION = 'Path=/; Domain';
const COOKIE_HOST = `Expires=${COOKIE_EXPIRE}; ${LOCATION}`;
const BYTE  = 256;
const POOL_LENGTH = 1;



const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  const bytes = crypto.randomBytes(base);
  let token = new Array(TOKEN_LENGTH);
  for (let i = 0; i < TOKEN_LENGTH; ++i)
  {
    const index = ((bytes[i] * base) / BYTE) | 0;
    token[i] = ALPHA_DIGIT[index];
  }
  token = token.join(',').toString();
  return token;
};



const parseHost = host => {
  if (!host) return 'no-host-in-headers';
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};

const parseCookies = cookie => {
  const parsedCookie = {};
  const items = cookie.split(';');
  for (const item of items) {
    const cookieMap = item.split('=');
    const key = cookieMap[0].trim();
    const tmp = cookieMap[1] || '';
    parsedCookie[key] = tmp.trim();
  }
  if (!parsedCookie) return null
  return parsedCookie;
};


const sessions = new Map();
const pool = [];


module.exports = app => {
  const { database } = app;
  //console.dir(database);
  const fillVMPool = () => {
      const sandboxesNumber = POOL_LENGTH - pool.length;
      for (let i = 0; i < sandboxesNumber; i++)
      {
        const sandbox = app.createSandbox();
        pool.push(sandbox);
        console.log(1)
      }
  };

  const getSandbox = () => {
    if (pool.length == 0) {
    setTimeout(() => {
        fillVMPool();
      }, 0);
    }
    if (pool.length > 0)
    {
      const sandbox = pool.pop();
      return sandbox;
    }
    return app.createSandbox();
  }

  class Session extends Map {
  constructor(token, cookie, sandbox, contextData = { token }) {
    super();
    const contextHandler = {
      set: (data, key, value) => {
        const res = Reflect.set(data, key, value);
        save(token, this.data);
        return res;
      }
    };
    this.token = token;
    this.cookie = cookie;
    this.sandbox = sandbox;
    this.data = contextData;
    this.context = {};
  }
}

  const start = (req, userId) => {
    const token = generateToken();
    const parsedHost = parseHost(req.headers.host);
    const expires = `expires=${COOKIE_EXPIRE}`;
    let cookie = `${TOKEN}=${token}; ${expires};
                  ${COOKIE_HOST}=${parsedHost}; HttpOnly`;
    const sandbox = getSandbox();
    const session = new Session(token, cookie, sandbox);
    sessions.set(token, session);
    const data = JSON.stringify(session.data);
    database.insert('Sessions', { userId, token, data });
    return session;
  }

  const restore = async (req) => {
    const { cookie } = req.headers;
    if (!cookie) return null;
    const cookies = parseCookies(cookie);
    const token = cookies.token;
    if (!token) return null;
    let session = sessions.get(token);

    if (!session) {
      const [raw] = await database.select('Sessions', ['Data'], { token });
      if (raw) {
        if (raw.data) {
          const data = JSON.parse(raw.data);
          const sandbox = getSandbox();
          session = new Session(token, cookie, sandbox, data);
          sessions.set(token, session);
        }
      }
    }
    if (!session) return null;
    return session;
  }

  const getUser = login => database
    .select('SystemUsers', ['Id', 'Password', 'Fullname'], { login })
    .then(([user]) => user);

  const registration = (login, password, fullName) => {
      database.insert('SystemUsers', { login, password, fullName });
  };

  const deleteSession = (req, res, token) => {
    const host = parseHost(req.headers.host);
    res.setHeader('Set-Cookie',
                  `${TOKEN}=deleted; Expires=${EPOCH};
                  ${LOCATION}=` + host
                 );
    sessions.delete(token);
    database.delete('Sessions', { token });
  }

  return { fillVMPool, start, restore, getUser, deleteSession, registration };
};
