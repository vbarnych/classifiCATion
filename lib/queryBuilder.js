'use strict';

const { Pool } = require('pg');

const where = (conditions, firstArgIndex = 1) => {
  const clause = [];
  const args = [];
  let i = firstArgIndex;
  const keys = Object.keys(conditions);
  for (const key of keys) {
    let operator = '=';
    let value = conditions[key];
    if (typeof value === 'string') {
      for (const op of OPERATORS) {
        const len = op.length;
        if (value.startsWith(op)) {
          operator = op;
          value = value.substring(len);
        }
      }
      if (value.includes('*') || value.includes('?')) {
        operator = 'LIKE';
        value = value.replace(/\*/g, '%').replace(/\?/g, '_');
      }
    }
    clause.push(`${key} ${operator} $${i++}`);
    args.push(value);
  }
  return { clause: clause.join(' AND '), args };
};

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
