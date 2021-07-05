const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var UserModel = require('../models/user.model');

module.exports = (req, res, next) => {
    console.log(req.body);
    UserModel.findOne({ email: req.body.email })
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id, user_roles: user.roles },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
  };