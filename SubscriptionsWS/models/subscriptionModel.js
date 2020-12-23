const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
    {
        memberId: String,
        movies: [{movieId: String, date: Date}]
    }
)
module.exports = mongoose.model("subscriptions", SubscriptionSchema)