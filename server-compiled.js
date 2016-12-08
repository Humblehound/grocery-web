'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var book = require('./app/routes/book');
var item = require('./app/routes/item');
var user = require('./app/routes/user');
var config = require('config'); //we load the db location from the JSON files
var jwt = require('jsonwebtoken');
var cors = require('cors');

//db options
var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

//db connection
var db_name = 'grocery';
var mongodb_connection_string = 'mongodb://localhost:27017/' + db_name;
//take advantage of openshift env vars when available:
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

mongoose.connect(mongodb_connection_string, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(morgan('dev'));
app.use(cors());

//don't show the log when it is test
// if(config.util.getEnv('NODE_ENV') !== 'test') {
// 	//use morgan to log at command line
// 	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
// }


//parse application/json and look for raw text
app.set('superSecret', config.secret); // secret variable

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

var apiRoutes = express.Router();
apiRoutes.use(function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {

        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

app.get("/", function (req, res) {
    return res.json({ message: "Welcome to our Bookstore!" });
});

app.route("/login").post(user.login);
app.route("/register").post(user.register);

app.use('/user/:id', apiRoutes);
app.route("/user/:id").delete(user.deleteUser);

app.use('/item', apiRoutes);
app.route("/item").post(item.postItem).get(item.getItems);

app.use('/item/:id', apiRoutes);
app.route("/item/:id").get(item.getItem).delete(item.deleteItem).put(item.updateItem);

app.use('/item/:id/synchronize', apiRoutes);
app.route("/item/:id/synchronize").post(item.synchronize);

app.route("/book").get(book.getBooks).post(book.postBook);
app.route("/book/:id").get(book.getBook).delete(book.deleteBook).put(book.updateBook);

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '192.168.0.223';

app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", server_port " + server_port);
});

module.exports = app; // for testing

//# sourceMappingURL=server-compiled.js.map