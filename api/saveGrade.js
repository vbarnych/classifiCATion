'use strict';



module.exports = async ({ userId, catId, grade }) => {
  const record = { userId, catId, grade };
  const queryResult = application.database
    .insert('EvaluatedCats', record);
  if (queryResult) return { result: 'success' };
}
