'use strict';

const crypto = require('crypto');
const TOKEN = 'token';
const TOKEN_LENGTH = 80;
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;
const COOKIE_EXPIRE = 'Fri, 01 Jan 2100 00:00:00 GMT';
const EPOCH = 'Thu, 01 Jan 1970 00:00:00 GMT';
const LOCATION = 'Path=/; Domain';
const COOKIE_HOST = `Expires=${COOKIE_EXPIRE}; ${LOCATION}`;
const BYTE  = 256;
const POOL_LENGTH = 10;



const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  const bytes = crypto.randomBytes(base);
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
  this.pool = [];

  const fillVMPool = () => {
      const sandboxesNumber = POOL_LENGTH - this.pool.length;
      for (let i = 0; i < sandboxesNumber; ++i)
      {
        const sandbox = this.app.createSandbox();
        this.pool.push(sandbox);
      }
  }

  const getSandbox = () => {
    if (this.pool.length == 0) {
    setTimeout(() => {
        fillVMPool();
        poolOpened = true;
      }, 0);
    }
    if (this.pool.length > 0)
    {
      const sandbox = this.pool.pop();
      return sandbox;
    }
    return this.app.createSandbox();
  }

  class Session extends Map {
    constructor(token, cookie, sandbox) {
      super();
      this.token = token;
      this.cookie = cookie;
      this.sandbox = sandbox;
    }
  }

  const start = (req) => {
    const token = generateToken();
    const parsedHost = parseHost(req.headers.host);
    const expires = `expires=${COOKIE_EXPIRE}`;
    let cookie = `${TOKEN}=${token}; ${expires};
                  ${COOKIE_HOST}=${parsedHost}; HttpOnly`;
    const sandbox = app.createSandbox();
    const session = new Session(token, cookie, sandbox);
    sessions.set(token, session);
    return session;
  }

  const restore = (req) => {
    const { cookie } = req.headers;
    if (!cookie) return null;
    const parsedCookie = parseCookies(cookie);
    const sessionToken = parsedCookie.token;
    if (!sessionToken) return null;
    const session = sessions.get(sessionToken);
  }

  const deleteSession = (req, res, token) => {
    const host = parseHost(req.headers.host);
    res.setHeader('Set-Cookie',
                  `${TOKEN}=deleted; Expires=${EPOCH};
                  ${LOCATION}=` + host
                 );
    sessions.delete(token);
  }
  return { fillVMPool, start, restore, deleteSession };
};
