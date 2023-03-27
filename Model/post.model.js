const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    userId : {type:String, required:true},
    title : {type:String, required:true, unique:true},
    body : {type:String, required:true},
    device : {type:String, enum: ['Laptop', 'Mobile', 'Tablet'], required:true},
    no_of_comments : {type:Number, required:true}
},
{
    versionKey:false
})

const PostModel = mongoose.model('post',postSchema);


module.exports = {PostModel}

