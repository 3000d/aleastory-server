module.exports = class Database {
  constructor(db) {
    this.db = db;
  }

  getLocation(callback) {
    let self = this;

    self.db.serialize(function () {
      self.db.each("SELECT location FROM data ORDER BY rowid DESC LIMIT 1", function (err, row) {
        if(err) {
          console.error(err);
          return;
        }

        if(callback) {
          callback(row.location);
        }
      });
    });
  }

  setLocation(location, callback) {
    let self = this;

    if(!location) {
      return;
    }

    self.db.serialize(function () {
      var stmt = self.db.prepare("INSERT INTO data VALUES (?)");
      stmt.run(location);
      stmt.finalize();

      if(callback) {
        callback();
      }
    });
  }
}