async ({ login, password }) => {
  const user = await app.sessions.getUser(login);
  console.dir(user);
  const hash = user ? user.password : undefined;
  if (!user || !correctPass) throw new Error('Login or password incorrect');
  console.log(`Logged user: ${login}`);
  return { result: 'success', userId: user.id, fullname: user.fullname, };
};
