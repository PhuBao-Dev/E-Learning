const express = require('express')
const course = require('../models/course')
const router = express.Router()

const Courses = require('../models/course')

router.get('/course', (req, res, next) => {
    Courses.find({})
        .then(courses => res.render('./pages/me/meCourse', {courses}))
        .catch(next)
})


module.exports = router