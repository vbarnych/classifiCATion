'use strict';

module.exports = async ({ login, password, fullname }) => {
  const user = { login, password, fullname };
  const queryResult = application.database
    .insert('Users', user);
  if (queryResult === false)
  {
    console.log('registration is failed');
  }
};
