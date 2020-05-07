async ({ login, password }) => {
  const where = { login, password };
  //const id = await app.database.select('SystemUsers', ['Id'], where);
  const [user] = await app.database.select(
    'SystemUser', ['Password'], { login }
  );
    //console.log(id);
  if (!id) throw new Error('Incorrect login or password');
  console.log(`Logged user: ${login}`);
  return { result: 'success', userId: user.id };
}
