async () => {
  const fields = ['Id', 'fullname'];
  const data = await application.database.select('SystemUsers', fields);
  return { result: 'success', data };
};
