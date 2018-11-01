exports.setup = function (dbUtils, db) {
    dbUtils.getAllUsers = function (callback) {
        //return db.users.find().toArray(callback);
    }

    dbUtils.getUserData = function (username, callback) {

    }

    dbUtils.saveNewUser = function (username, callback) {

    }
}