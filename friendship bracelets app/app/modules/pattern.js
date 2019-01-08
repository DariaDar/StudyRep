var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.set('debug', true);

var Pattern = new Schema({
    title: {
        type: String,
        required: true
    },
    author: { type: String, ref: 'User' },
    date: { type: Date },
    image: String,
    comments: [{ body: String, author:{ type: String, ref: "User"}}]
});


module.exports = mongoose.model('Pattern', Pattern);
