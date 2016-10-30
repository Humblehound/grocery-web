'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = 8080;
var book = require('./app/routes/book');
var item = require('./app/routes/item');
var user = require('./app/routes/user');
var config = require('config'); //we load the db location from the JSON files
var jwt = require('jsonwebtoken');

//db options
var options = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

//db connection      
mongoose.connect(config.DBHost, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(morgan('dev'));

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

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

app.use('/item', apiRoutes);
app.route("/item").post(item.postItem);

app.use('/item/:id', apiRoutes);
app.route("/item/:id").get(item.getItem).delete(item.deleteItem).put(item.updateItem);

app.route("/book").get(book.getBooks).post(book.postBook);
app.route("/book/:id").get(book.getBook).delete(book.deleteBook).put(book.updateBook);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing

//# sourceMappingURL=server-compiled.js.map