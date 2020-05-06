'use strict';

module.exports = async ({ login, password }) => {
  const user = { login, password };
  const queryResult = application.database
    .insert('Users', user);
  if (queryResult === false)
  {
    console.log('registration is failed');
  }
};
