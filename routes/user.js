const express = require('express')
const { redirect } = require('express/lib/response')
const Users = require('../models/user')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/', (req, res, next) => {
    res.render('./pages/authentication/welcome')
})

router.get('/login', (req, res, next) => {
    if(req.user) res.redirect('/')
    else res.render('./pages/authentication/login')
})
router.get('/register', (req, res, next) => {
    res.render('./pages/authentication/register')
})

router.post('/register', (req, res, next) => {
    const {name, email, password} = req.body
    let errors = []

    if( !name || !email || !password ) {
        errors.push('Vui vòng điển đầy đủ tất cả các trường')
    }
    if(password.length < 6) {
        errors.push('Mật khẩu phải ít nhất là 6 kí tự')
    }


    if(errors.length > 0)
    {
        res.render('./pages/authentication/register', {errors, name, email, password})
    }
    else{
        Users.findOne({email: email})
            .then(user => {
                if(user) {
                    errors.push('Email này đã được đăng ký rồi')
                    res.render('./pages/authentication/register', {errors, name, email, password})
                }
                else {

                    const newUser = new Users({name, email, password});
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err
                            newUser.password = hash
                            newUser.save()
                                .then(() => {
                                    req.flash('success_msg', 'Bạn đã đăng ký thành công và có thể đăng nhập')
                                    res.redirect('/user/login')})
                                .catch(err => {})
                        })
                    })
                }
                
            })
            .catch(next)
    }

})


router.post('/login', (req, res, next) => {
    const {email, password} = req.body
    // res.json({email, password})

    let errors = []
    if(!email || !password ) {
        errors.push('Vui vòng điển đầy đủ tất cả các trường')
    }
    if(password.length < 6) {
        errors.push('Mật khẩu phải ít nhất là 6 kí tự')
    }
    if(errors.length > 0)
    {
        res.render('./pages/authentication/login', {errors, email, password})
    }
    else{
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/user/login',
            failureFlash: true
        })(req, res, next)
    }



})

router.get('/logout', (req, res, next) => {
    req.logout();
    // req.flash('success_msg', 'Bạn đã đăng xuất thành công');
    res.redirect('/')
})


router.get('/db', (req, res, next) => {
    Users.find({})
        .then(courses => res.json(courses))
        .catch(next)
})


module.exports = router