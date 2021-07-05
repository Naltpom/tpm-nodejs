const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedtoken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedtoken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'user ID non valable';
        } 
        
        userModel.findOne({_id: userId}).then(() => {console.log("object");next();}).catch(err => res.status(600).json({err}))
    } catch (error) {
        error.auth = 'Requête non authentifié';
        res.status(401).json({ error: error})
    }
}


