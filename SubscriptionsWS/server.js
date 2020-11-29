const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const initialBL = require('./models/initialBL');

require('./configs/dbConfig');

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

app.use(cors());

app.use('/api/movies', require('./routes/moviesRouter'));
app.use('/api/members', require('./routes/membersRouter'));


/*
app.get('/', function(req, resp){
    resp.send("Heee ekko")

})
*/
initialBL.initDB();
//app.get('/', require('./routers/initialRouter'))

app.listen(8000);