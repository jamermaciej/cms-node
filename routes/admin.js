const express = require('express');
const News = require('../models/news');
const router = express.Router();

// dotyczy wszystkiego pod adresem /admin, GET, POST, itp
router.all('*', (req, res, next) => {
  if ( !req.session.admin ) {
    return res.redirect('/login');
  }
  next();
});

router.get('/', (req, res) => {
  News.find({}, (err, data) => {
    res.render('admin/index', { title: 'Admin', data });
  })
});

router.get('/news/add', (req, res) => {
  res.render('admin/news-form', { title: 'Dodaj news', errors: {}, body: {} });
});

router.post('/news/add', (req, res) => {
  const body = req.body;
  const newsData = new News(body);
  const errors = newsData.validateSync();
  newsData.save(err => {
    if (err) {
      res.render('admin/news-form', { title: 'Dodaj news', errors, body });
      return;
    }
    res.redirect('/news/list');
  });
});

router.get('/news/delete/:id', (req, res) => {
  News.findByIdAndDelete(req.params.id, err => {
    res.redirect('/admin');
  });
});

module.exports = router;
