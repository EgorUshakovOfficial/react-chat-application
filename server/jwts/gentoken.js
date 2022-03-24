const jwt = require('jsonwebtoken');

// options 
const opts = {
    expiresIn: Math.floor(Date.now()/1000) + (60*60) // One hour expiry date
}

const genAuthToken = user => {
    return jwt.sign(user, process.env.JWT_SECRET, opts)
}

const genRefreshToken = user => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, opts)
    return refreshToken; 
}

module.exports = {
    genAuthToken,
    genRefreshToken
}