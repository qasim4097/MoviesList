const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const MovieRoutes = express.Router();
const mongoose = require('mongoose');
const app = express();
const passport = require("passport");
app.use(cors());
app.use(bodyParser.json());

const http = require('http').createServer(app);
const io = module.exports.io = require('socket.io')(http);
const SocketManager = require('./config/socket-manager')

io.on('connection', SocketManager)
io.listen('5000')

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
})
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
require('./config/passport')

// Routes
require('./app/routes.js')(app, passport);

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
})