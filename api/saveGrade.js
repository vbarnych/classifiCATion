async ({ userId, catId, grade }) => {
  const record = { userId, catId, grade };
  const queryResult = app.database
    .insert('EvaluatedCats', record);
  if (queryResult) return { result: 'success' };
}
