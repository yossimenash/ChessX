var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var mongoClient = mongodb.MongoClient;

var db = null;
var consts = null;
var collections = ['users'];
var repositories = ['authorization'];

exports.collections = collections;

exports.setupDB = function (constants, callback) {
  consts = constants;

  mongoClient.connect(consts.dbUrl, function (err, client) {
    if (err) {
      console.log('Could not connect to DB');
      return;
    }

    var database = client.db('local');

    console.log('Connected to DB');

    for (index in collections) {
      var collectionName = collections[index];
      database[collectionName] = database.collection(collectionName);
    }

    for (index in repositories) {
      var repository = require('./repositories/' + repositories[index]);
      repository.setup(exports, database);
    }

    callback();
  });
}

exports.toObjectID = function (str) {
  return new ObjectID(str);
}

exports.newObjectID = function() {
  return new ObjectID();
}
