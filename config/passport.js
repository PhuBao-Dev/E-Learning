const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Users = require('../models/user')

module.exports = function(passport) {
    passport.use( 
        new LocalStrategy({usernameField: 'email'}, (email, passport, done)=> {
            Users.findOne({email: email})
                .then(user => {
                    if(!user) {
                        return done(null, false, {message: 'Email này chưa được đăng ký'})
                    }
                    bcrypt.compare(passport, user.password, (err, isMatch) => {
                        if(err) throw err

                        if(isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, {message: 'Mật khẩu không chính xác'})
                        }
                    })  
                })
                .catch(err => console.log(err));
        })

        
    )
    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user.id); 
    // where is this user.id going? Are we supposed to access this anywhere?
    });

    // used to deserialize the user
    passport.deserializeUser((id, done) => {
        Users.findById(id, (err, user) => {
            done(err, user);
        });
    });

}