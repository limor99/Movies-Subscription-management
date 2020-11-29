const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    name: String,
    email: String,
    city: String
});

module.exports = mongoose.model('members', MemberSchema);