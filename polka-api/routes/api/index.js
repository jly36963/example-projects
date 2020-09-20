// imports
const polka = require('polka');
const router = polka()

// middleware import
const sayHello = require('../../middleware/say-hello')

// routes
router.get('/', sayHello, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data: 'Hello world!', error: null }));
})

router.post('/', (req, res) => {
  const { body } = req;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data: body, error: null }));
})

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const data = { id };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data, error: null }));
});

router.get('/search', (req, res) => {
  const { query } = req;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data: query, error: null }));
})

module.exports = router;