const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/subscriptionsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

const db = mongoose.connection;
mongoose.set('useFindAndModify', false);

mongoose.set("debug", (collectionName, method, query, doc) => {
    console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
});



db.on('open', () =>{
    console.log('DB CONNECTED')
})