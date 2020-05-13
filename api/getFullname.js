async () => {
  const fields = ['Id', 'fullname'];
  const data = await app.database.select('SystemUsers', fields);
  return { result: 'success', data };
};
