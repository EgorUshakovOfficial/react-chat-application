const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const server = http.createServer(app); 
const mongoose = require("mongoose");
const routes = require('./routes');
const { User } = require('./models/User');
const session = require('express-session');
const passport = require('passport');
const auth = require('./auth/auth');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const { Server } = require("socket.io");
const io = new Server(server); 
const path = require("path"); 
// Dotenv
require('dotenv').config();

// Connect to db 
mongoose
.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Mongodb connected.."))
.catch(err => console.log(err));

// Middleware functions 
const ignoreFavicon = (req, res, next)=>{
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end()
    }
    next();
}
// Middleware 
app.use(cors({
    origin: "*",
    credentials: true,
    methods:["GET", "POST"]
}));
app.use(ignoreFavicon);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    key:"express.sid",
    cookieParser: cookieParser,
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure:true,
        maxAge: 86400,
        sameSite: "none"
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))
app.use(passport.initialize());
app.use(passport.session());



// Authorization
auth();

// Routes 
routes(app, User);

// Socket Io middleware
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(session({
    key: "express.sid",
    cookieParser: cookieParser,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        maxAge: 86400,
        sameSite: "none"
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
})));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
    if (socket.request.user) {
        next();
    } else {
        next(new Error("unauthorized"))
    }
});

// Socket Io events  
io.on("connection", socket => {
    const { firstName, lastName, _id} = socket.request.user; 

    // Active users
    User
    .findOne({_id})
    .then(user => {
        user.online = true;
        user.save((err, user) => {
            if (err) {
                console.log(err); 
            }
            User
            .find({ online: true })
            .then(users => {
                users = users.map(user => {
                    return {
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                });
                io.emit("user joined", users); 
            })
        })
    })

    // Chatbot message 
    socket.broadcast.emit("message", { message: `${firstName} ${lastName} has joined the chat`, id: false });

    // Messages 
    socket.on("message", data => {
        io.emit("message", data);
    })

    // Disconnect 
    socket.on('disconnect', () => {
        User
            .findOne({ _id })
            .then(user => {
                user.online = false;
                user.save((err, user) => {
                    if (err) {
                        console.log(err);
                    }
                    User
                        .find({ online: true })
                        .then(users => {
                            users = users.map(user => {
                                return {
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                };
                            });
                            // User left 
                            io.emit("user left", users);
                        })
                })
            })

        // Disconnect message
        io.emit("message", { message: `${firstName} ${lastName} has left the chat`, id: false });
    })
})

// Serve static assets if in production 
if (process.env.NODE_ENV === "production") {
    // Set static folder 
    app.use(express.static('client/build'));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })
}
// Initialize server 
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));