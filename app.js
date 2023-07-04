const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res, next) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => {
      res.render('beers', { layout: 'layout', beers: beersFromApi });
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: 'Failed to fectch beers' });
    });
});

app.get('/beers/:id', (req, res, next) => {
  const beerId = req.params.id;

  punkAPI
    .getBeer(beerId)
    .then(beer => {
      res.render('partials/beer', { layout: 'layout', beer: beer[0] });
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: 'Failed to fetch beer' });
    });
});



app.get('/random-beer', (req, res, next) => {
  punkAPI
    .getRandom()
    .then(responseFromApi => {
      const beer = responseFromApi[0];
      res.render('random-beer', {
        layout: 'layout',
        beer: beer
      });
    })
    .catch(error => {
      console.log(error);
      res.render('error', { error: 'Failed to fectch beers' });
    });
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
