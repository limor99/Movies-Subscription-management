const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubscriptionSchema = new Schema(
    {
        memberId: ObjectId,
        movies: [{movieId: ObjectId, date: Date}]
    }
)
module.exports = mongoose.model("subscriptions", SubscriptionSchema)