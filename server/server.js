import express from 'express';
import * as env from 'dotenv';
import path from 'path';

env.config();

const port = process.env.PORT || 3000;

const App = express();

App.set('views', path.join(path.dirname(new URL(import.meta.url).pathname), 'views'));
App.set('view engine', 'ejs');

App.use(express.static('client'));
App.use('/favicon.ico', express.static('img/icon/favicon.ico'));

App.get('/', (request,response)=>{
    response.render('pages/index');
});

App.listen(port, ()=> console.log(`Tulips server listening on port ${port}`));