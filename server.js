const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const server = require("http").createServer(app);
const mongoose = require("mongoose");
const routes = require('./routes');
const { User } = require('./models/User');
const session = require('express-session');
const passport = require('passport');
const auth = require('./auth/auth');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
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
    credentials: true
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
io.use((socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        User
            .findOne({ _id: payload._id})
            .then(user => {
                socket.user = user;
                next();
            })
            .catch(err => {
                next(err);
            })
    }
    catch (err) {
        next(err);
    }
})
io.use((socket, next) => {
    if (socket.user) {
        next();
    } else {
        next(new Error("unauthorized"))
    }
})

// Socket Io events
io.on("connection", socket => {
    console.log(`User with ${socket.request.user} connected`)
    const {firstName, lastName, _id} = socket.user;

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
        console.log(`User with ${socket.id} connected`)
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
const PORT = process.env.PORT || 443;
server.listen(PORT,  () => console.log(`Listening on port ${PORT}...`));