const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next(); //to prevent blocking certain request
    }
    try{
        const token = req.headers.authorization.split(' ')[1] //get the token from authorization header Authorization: 'Bearer TOKEN'
        if(!token) {
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token,process.env.JWT_KEY); //validate token
        req.userData = {userId: decodedToken.userId} // add data to he request
        next(); //let the request continue
    }catch(err){
        const error = new HttpError('Authentication failed!',401);
        return next(error);
    }
    
};