const EventEmitter = require('events');

class App extends EventEmitter {
  constructor(worker) {
    super();
    this.closed = false;
    this.worker = worker;
  async shutdown() {
    this.closed = true;
  };
}

module.exports = App;
