const {Schema, default: mongoose} = require('mongoose');



const curseSchema = new Schema({
    name: String,
    thumbnail: String,
    videos:[
        {title: String, videoUrl: String, duration: String,}
    ]
}, {
    timestamps: true,
})


module.exports = mongoose.model('Course', curseSchema)