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
}
