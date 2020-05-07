async ({ login, password }) => {
  const where = { login, password };
  const [user] = await app.database.select(
    'SystemUsers', ['Password'], { login }
  );
  if (!id) throw new Error('Incorrect login or password');
  console.log(`Logged user: ${login}`);
  return { result: 'success', userId: user.id };
}
