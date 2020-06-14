async ({ userId, catId}) => {
  const grade = await app
                        .database
                        .select('EvaluatedCats', ['Grade'], { userId, catId })
  return { result: 'success', grade };
}
