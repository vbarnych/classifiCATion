'use strict';

const { Pool } = require('pg');

class Database {
  constructor(config, app) {
    this.pool = new Pool(config);
    this.app = app;
  }

  insert(table, record) {
    const keys = Object.keys(record);
    const keysNumber = new Array(keys.length);
    let i = 0;
    for (const key of keys) {
      const data = record[key];
      const type = typeof data;
      if (type === 'string')
      {
        data[++i] = `'${value}'`
      }
      else data[++i] = value.toString();
    }
  }
  close() {
    this.pool.end();
  }
}

module.exports = Database;
