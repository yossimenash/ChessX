exports.setupRoutes = function (expressServer, dbUtils, consts) {
    // Module declarations
    var authorizationModule = require('./modules/authorizationModule.js');

    // Module setups
    authorizationModule.setup(dbUtils);

    // Routes
    expressServer.get('/getUserDetails/:username', authorizationModule.getUserDetails);
    expressServer.get('/addNewUser/:username', authorizationModule.addNewUser);
}