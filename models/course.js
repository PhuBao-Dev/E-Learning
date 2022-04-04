const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Course = new Schema({
    title: { type: String, required: true},
    description: {type: String, required: true},
    img: {type: String},
    videoID: {type: String}, 
    slug: {type: String, slug: 'title', unique: true}

}, {timestamps: true})

module.exports = mongoose.model('courses', Course)