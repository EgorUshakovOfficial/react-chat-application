const mongoose = require('mongoose');

// User schema
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String },
    refreshtoken: { type: String },
    online: {type:Boolean, default: false}
});

// User model
const User = mongoose.model("User", userSchema);

module.exports = { User }; 

