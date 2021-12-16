const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true},
        comments: {type: [[String,String]],required:true},
        views: {type:Number,required:true},
        published: {type: Boolean,required:true},
        likedBy: {type: [String],required:true},
        dislikedBy: {type: [String],required:true},
        ownedBy: { type: String, required: true },
        publishDate: { type: String, required: true },
        votes: {type: [Number],required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
