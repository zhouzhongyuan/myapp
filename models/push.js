
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var taskSchema   = new Schema({
    user: String,
    channelId: String,
});

module.exports = mongoose.model('push', taskSchema);