const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Subscription = new Schema(
    {
        memberId: ObjectId,
        movies: [{movieId: ObjectId, date: Date}]
    }
)