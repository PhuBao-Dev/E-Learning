const express = require('express')
const { redirect } = require('express/lib/response')
const router = express.Router()

const Courses = require('../models/course')

router.get('/create', (req, res, next) => {
    res.render('./pages/course/courseCreate', { name: req.user.name})
})

router.get('/:id/edit', (req, res, next) => {
    Courses.findById(req.params.id)
        .then(course => res.render('./pages/course/courseEdit', { course }))
        .catch(next)
})

router.get('/:slug', (req, res, next) => {
    Courses.findOne({ slug: req.params.slug })
        .then(course => res.render('./pages/course/courseDetail', { course }))
        .catch(next)
})


router.post('/store', (req, res, next) => {
    req.body.img = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`
    const course = new Courses(req.body);
    course.save()
        .then(() => res.redirect('/'))
        .catch(err => {})
})

router.put('/:id', (req, res, next) => {
    req.body.img = `https://img.youtube.com/vi/${req.body.videoID}/sddefault.jpg`
    Courses.findOneAndUpdate({_id: req.params.id}, req.body)
        .then(() => res.redirect('/me/course'))
        .catch(err => {})
})


router.delete('/:id', (req, res, next) => {
    Courses.deleteOne({_id: req.params.id})
        .then(course => res.redirect('back'))
        .catch(next)  
})






module.exports = router