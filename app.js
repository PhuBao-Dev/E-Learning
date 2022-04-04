const express = require('express')
const app = express()
const db = require('./db/index')
const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts');
const Courses = require('./models/course')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')  
const {ensureAuthenticated} = require('./config/auth')
// Passport config
require('./config/passport')(passport)

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user
    next()

})

app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(expressLayouts);
app.use(express.urlencoded({extended: true}))


db.connect();


app.get('/', (req, res, next) => {
    Courses.find({})
        .then(courses => res.render('./pages/course/course', { courses }))
        .catch(next)
})


const appCourse = require('./routes/course')
app.use('/course', ensureAuthenticated, appCourse)  

const appUser = require('./routes/user')
app.use('/user', appUser)

const appMe = require('./routes/me');
app.use('/me', ensureAuthenticated, appMe)

const port = process.env.PORT || 3000;
app.listen(port)
 