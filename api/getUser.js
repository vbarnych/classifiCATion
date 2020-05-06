'use strict';



module.exports = async ({ login }) => {
  db.select('SystemUser', ['Id', 'Password'], { login })
    .then(([user]) => user);
}
