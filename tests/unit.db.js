'use strict';

const assert = require('assert').strict;
const path = require('path');

const app = require('../lib/app.js');

const Database = require('../lib/queryBuilder.js');
assert(Database);

const Config = require('../lib/config.js');
assert(Config);

const PATH = process.cwd();

(async () => {
  const configPath = path.join(PATH, 'config');
  const config = await new Config(configPath);

  setTimeout(async () => {
    const databaseConfig = config.units.databaseConfig;
    const database = new Database(databaseConfig);
    const empty = 'empty';
    try {
      const user = { login: empty, password: empty, fullName: empty };
      const result = await database.insert('SystemUsers', user);
      assert(result);
      assert.equal(result.rowCount, 1);
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
    try {
      const fields = ['login', 'password'];
      const where = { login: empty };
      const [record] = await database.select('SystemUsers', fields, where);
      assert.equal(record.login, empty);
      assert.equal(record.password, empty);
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
    try {
      const delta = { password: empty };
      const where = { login: empty };
      const result = await database.update('SystemUsers', delta, where);
      assert.equal(result.rowCount, 1);
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
    try {
      const where = { login: empty };
      const result = await database.delete('SystemUsers', where);
      assert.equal(result.rowCount, 1);
    } catch (err) {
      console.log(err.stack);
      process.exit(1);
    }
    database.close();
  }, 100)
})();
