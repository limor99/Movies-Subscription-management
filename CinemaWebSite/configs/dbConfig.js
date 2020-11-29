const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/usersProjectDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

const db = mongoose.connection;

db.on('open', () =>{
    console.log('DB CONNECTED')
})