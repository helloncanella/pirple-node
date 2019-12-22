const fs = require("fs");
const helpers = require("./helpers");
const path = require("path");

const lib = {};

lib.baseDir = path.join(__dirname, "/../.data/");

lib.create = function(dir, file, data, callback) {
  fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, function(err) {
        if (!err) {
          fs.close(fileDescriptor, function(err) {
            if (!err) {
              callback(false);
              return;
            }

            callback("Error closing new file");
          });
          return;
        }
        callback("Error writing this file");
      });

      return;
    }

    callback("could not create new file, it may already exists");
  });
};

lib.read = function(dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", function(
    err,
    data
  ) {
    if (!err && data) {
      const parsedData = helpers.parseJSONToObject(data);
      callback(false, parsedData);
    } else {
      callback(err, data);
    }
  });
};

lib.update = function(dir, file, data, callback) {
  fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", function(
    err,
    fileDescriptor
  ) {
    if (!err && fileDescriptor) {
      const stringData = JSON.stringify(data);
      fs.truncate(fileDescriptor, function(err) {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, function(err) {
            if (!err) {
              callback(false);
            } else {
              callback("error writing to existing file ");
            }
          });
        } else {
          callback("error truncating file");
        }
      });
    } else {
    }
  });
};

lib.delete = function(dir, filename, callback) {
  // callback()
  fs.unlink(lib.baseDir + dir + "/" + filename + ".json", function(err) {
    if (!err) callback(err);
    else {
      console.log(err);
      callback("error deleting file");
    }
  });
};

module.exports = lib;
