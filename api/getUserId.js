async ({ token }) => {
  database.select('Sessions', ['UserId'], { token })
    .then(([user]) => user);
}

async ({ token }) => {
  const user = await app.database.select();
};
