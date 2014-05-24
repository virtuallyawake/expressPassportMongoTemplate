var mongoose = require('mongoose');

var schema = mongoose.Schema({
    _id  : { type: String, trim: true },
    salt : { type: String, required: true},
    hash : { type: String, required: true}
});

module.exports = mongoose.model('User', schema);
