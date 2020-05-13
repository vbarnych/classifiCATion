'use strict';

module.exports = async ({ login, password, fullname }) => {
  const hash = await app.Crypto.hashPassword(password);
  await app.sessions.registration(login, hash, fullname);
  return { result: 'success' };
};
