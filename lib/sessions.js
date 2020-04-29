'use strict';

const TOKEN = 'token';
const TOKEN_LENGTH = 80;
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const LOCATION = 'Path=/; Domain';
const COOKIE_HOST = `Expires=${COOKIE_EXPIRE}; ${LOCATION}`;

const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  let token = new Array(TOKEN_LENGTH);
  for (let i = 0; i < TOKEN_LENGTH; ++i)
  {
    const index = ((bytes[i] * base) / BYTE) | 0;
    token[i] = ALPHA_DIGIT[index];
  }
  return token;
};


const parseHost = host => {
  if (!host) return 'no-host-in-headers';
  const portOffset = host.indexOf(':');
  if (portOffset > -1) host = host.substr(0, portOffset);
  return host;
};



const sessionsStorage = new Map();

class Session extends Map {
  constructor(token, cookie, sandbox) {
    super();
    this.token = token;
    this.cookie = cookie;
    this.sandbox = sandbox;
  }
}

class Sessions {
  constructor(app) {
    this.app = app;
  }

  start (req) {
    const token = generateToken();
    const parsedHost = parseHost(req.headers.host);
    const expires = `expires=${COOKIE_EXPIRE}`;
    let cookie = `${TOKEN}=${token}; ${expires};
                  ${COOKIE_HOST}=${parsedHost}; HttpOnly`;
    const session = new Session(token, cookie);
    sessionsStorage.set(token, session);
    return session;
  }

  restore (req) {
    const { cookie } = req.headers;
    if (!cookie) return null;
    const parsedCookie = parseCookies(cookie);
    const sessionToken = parsedCookie.token;
    if (!sessionToken) return null;
    const session = sessions.get(sessionToken);
    Object.setPrototypeOf(session, Session.prototype);
    return session;
  }

  delete(req, res, token) {
    const host = parseHost(req.headers.host);
    res.setHeader('Set-Cookie',
                  `${TOKEN}=deleted; Expires=${EPOCH};
                  ${LOCATION}=` + host
                 );
    sessions.delete(token);
  }
}

module.exports = Sessions;
