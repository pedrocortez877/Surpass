import express from 'express';
import path from 'path'
import 'express-async-errors'
import bodyParser from 'body-parser';

import './database/connection'

import routes from './routes'
import errorHandler from './errors/handler'

const app =  express();

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended: true})) 

var cors = require('cors');
app.use(cors());

app.use(routes);

app.use('/uploads', express.static(path.join(__dirname,  '..' , 'uploads')));

app.use(errorHandler);

app.listen(3333);