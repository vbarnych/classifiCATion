async ({ login, password }) => {
  const user = await app.sessions.getUser(login);
  const hash = user ? user.password : undefined;
  const correctPass = await application.security.validatePassword(password, hash);
  if (!user || !correctPass) throw new Error('Authentication failed.');
  console.log(`Logged user: ${login}`);
  return { result: 'success', userId: user.id, fullname: user.fullname, };
};
