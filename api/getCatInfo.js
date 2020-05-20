async (id) => {
  const cat = await app.sessions.getCat(id);
  return { result: 'success', cat };
};
