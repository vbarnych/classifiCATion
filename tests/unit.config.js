'use strict';

const path = require('path');
const assert = require('assert').strict;

const Config = require('..\\lib\\config.js');
assert(Config);
const PATH = process.cwd();
const configPath = path.join(PATH, 'config');

const config = new Config(configPath);
config.on('loaded', () => {
  assert(config.units);
  assert(config.units.databaseConfig);
  assert(config.units.serverConfig);
});
