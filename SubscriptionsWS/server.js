const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const cors = require('cors');
const initialBL = require('./models/initialBL');

require('./configs/dbConfig');

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

//app.use(cors());

app.use('/api/movies', require('./routes/moviesRouter'));
app.use('/api/members', require('./routes/membersRouter'));

//initialize the db when server starts
initialBL.initDB();

app.listen(8000);