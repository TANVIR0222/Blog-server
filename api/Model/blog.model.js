
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    content:{
        type: Object,
        required: true
    },
    coverImg:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    rating:Number
    
},{timestamps:true})

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog