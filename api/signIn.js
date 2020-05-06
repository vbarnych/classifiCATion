'use strict';



module.exports = async ({ login, password }) => {
  // const user = await application.api.getUser(login);

  db.select('SystemUsers', ['Id', 'Password'], { login })
    .then(([user]) => user);

  let hash = undefined;
  if (!user)
    throw new Error('Incorrect login');
  else hash = user.password;

  if (hash !== password)
  {
    throw new Error('Incorrect password');
  }
  console.log(`Logged user: ${login}`);
  return { result: 'success', userId: user.id };
}
