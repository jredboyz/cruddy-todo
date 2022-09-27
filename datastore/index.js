const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, uniqueId) => {
    var id = uniqueId;
    var newPath = path.join('test', 'testData', `${id}.txt`);
    fs.writeFile(newPath, text, () => {
      callback(err, { id, text });
    });
  });
  // var newPath = path.join(__dirname, 'data', `${id}.txt`);
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var todos = files.map((file) => {
      file = file.slice(0, 5);
      return { id: file, text: file };
    });
    callback(err, todos);
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  let found = false;
  fs.readdir(exports.dataDir, (err, files) => {
    for (let i = 0; i < files.length; i++) {
      if (id === files[i].slice(0, 5)) {
        found = true;
        let currentFile = files[i];
        let pathFile = path.join(exports.dataDir, currentFile);
        let test = '';
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
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

