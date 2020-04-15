'use strict';

const Emitter = require('events');
const path = require('path');
const fs = require('fs').promises;


class Config extends Emitter {
  constructor(configurationPath) {
    super();
    this.units = {};
    this.path = configurationPath;
    this.upload();
  }
  async upload() {
    const fileNames = await fs.readdir(this.path);
    for (const fileName of fileNames) {
      this.uploadFile(fileName);
    }
    this.emit('uploaded');
  }


  uploadFile(fileName) {
    const configFile = path.join(this.path, fileName);
    const unitName = fileName.substring(0, fileName.indexOf('.'));
    const exports = require(configFile);
    this.units[unitName] = exports;
  }
}

module.exports = Config;
