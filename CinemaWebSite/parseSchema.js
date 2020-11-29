const parseSchema = require('mongodb-schema');
const MongoClient = require('mongodb').MongoClient;
const dbName = 'usersProjectDB';

MongoClient.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, client) {
  if (err) return console.error(err);
 
  const db = client.db(dbName);
 
  // here we are passing in a cursor as the first argument. You can
  // also pass in a stream or an array of documents directly.
  parseSchema(db.collection('users').find(), function(err, schema) {
    if (err) return console.error(err);
 
    console.log(JSON.stringify(schema, null, 2));
    client.close();
  });
});
