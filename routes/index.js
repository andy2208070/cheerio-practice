import express from 'express';
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pages/cheer', function(req, res, next){
  res.render('pages/cheer-page');
});

// module.exports = router;
export default router;