async ({ userId }) => {
  const data = await app
      .database
      .select('EvaluatedCats', ['Grade', 'CatId'], { userId })
  return { result: 'success', data };
}
