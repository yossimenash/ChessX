var dbUtils = null;

exports.setup = function (db) {
    dbUtils = db;
}

exports.getAllUsers = function (req, res) {
    return dbUtils.getAllUsers(function (err, data) {
        res.send(data);
    });
}

exports.getUserDetails = function (req, res) {
    var username = req.params.username;

    // TODO: Get the user details by username, if user not exists, create a new user and user details
}

exports.addNewUser = function (req, res) {
    var username = req.body.username;

    // TODO: Save the new user and user details
}