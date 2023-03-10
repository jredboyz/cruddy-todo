const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

const readFilePromisify = Promise.promisify(fs.readFile);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, uniqueId) => {
    var id = uniqueId;
    var newPath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(newPath, text, () => {
      callback(err, { id, text });
    });
  });
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      var data = files.map((file) => {
        let id = file.slice(0, file.length - 4);
        return readFilePromisify(path.join(exports.dataDir, file), 'utf8')
          .then((todo) => { return { id: id, text: todo }; });
      });
      Promise.all(data)
        .then((todos) => callback(null, todos));
    }
  });

  // fs.readdir(exports.dataDir, (err, files) => {
  //   var todos = files.map((file) => {
  //     file = file.slice(0, file.length - 4);
  //     return { id: file, text: file };
  //   });
  //   callback(err, todos);
  // });

  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  let found = false;
  fs.readdir(exports.dataDir, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      if (id === files[i].slice(0, files[i].length - 4)) {
        found = true;
        let currentFile = files[i];
        let pathFile = path.join(exports.dataDir, currentFile);
        fs.readFile(pathFile, 'utf8', (err, data) => {
          var todo = { id: id, text: data };
          callback(err, todo);
        });
      }
    }
    if (!found) {
      callback(new Error(`No item with id: ${id}`));
    }
  });
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  let updated = false;
  fs.readdir(exports.dataDir, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      if (id === files[i].slice(0, files[i].length - 4)) {
        updated = true;
        let currentFile = files[i];
        let pathFile = path.join(exports.dataDir, currentFile);
        fs.writeFile(pathFile, text, (err) => {
          var todo = { id: id, text: text };
          callback(err, todo);
        });
      }
    }
    if (!updated) {
      callback(new Error(`No item with id: ${id}`));
    }
  });
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  let deleted = false;
  fs.readdir(exports.dataDir, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      if (id === files[i].slice(0, files[i].length - 4)) {
        deleted = true;
        let currentFile = files[i];
        let pathFile = path.join(exports.dataDir, currentFile);
        fs.unlink(pathFile, (err) => {
          callback(err);
        });
      }
    }
    if (!deleted) {
      callback(new Error(`No item with id: ${id}`));
    }
  });
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

