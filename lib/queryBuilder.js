'use strict';

const { Pool } = require('pg');

class Database {
  constructor(config, app) {
    this.pool = new Pool(config);
    this.app = app;
    this.closed = true;
  }

  query(sql, values) {
    console.log(`${sql}\t[${values.join(',')}]`);
    return this.pool.query(sql, values);
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

  async select(table, fields = ['*'], conditions = null) {
    const keys = fields.join(', ');
    const sql = `SELECT ${keys} FROM ${table}`;
    let whereClause = '';
    let args = [];
    if (conditions) {
      const whereData = where(conditions);
      whereClause = ' WHERE ' + whereData.clause;
      args = whereData.args;
    }
    const res = await this.query(sql + whereClause, args);
    return res.rows;
  }

  close() {
    this.pool.end();
  }
}

module.exports = Database;
