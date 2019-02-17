const express = require('express');
const Massive = require('massive');

const app = express();
const port = 3000;

const massive = Massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'bm',
  password: '',
  ssl: false,
  poolSize: 10
});

app.get('/', (req, res) => {
    let help = {
		"Available API endpoints": {
		"GET /users": "List all users",
		"GET /users/<id>": "List user with given ID",
		"GET /products[?name=<name>]": "List all products (optional name filter)",
		"GET /products/<id>": "List product with given ID",
		"GET /purchases": "List all purchases"
		}
	};

    res.status(200).send(help);
});

app.get('/users', (req, res) => {
    massive.then(db => {
        db.users.find({}, {
            fields: ['email', 'details'],
            order: [{
                field: 'created_at',
                direction: 'desc',
            }]
        })
        .then(dbresult => {
            res.status(200).send(dbresult)
        })
        .catch((err) => res.status(404).send());
    }).catch((err) => res.send(err));
});

app.get('/users/:id', (req, res) => {
    massive.then(db => {
      db.users.findOne(req.params.id, {
          fields: ['email', 'details'],
          order: [{
              field: 'created_at',
              direction: 'desc',
          }]
      })
      .then(dbresult => {
          res.status(200).send(dbresult)
      })
      .catch((err) => res.status(404).send());
  }).catch((err) => res.send(err));
});

app.get('/products', (req, res) => {
    massive.then(db => {
        /* example URL (with parameters decoded) to launch an SQL injection attack:
         * 127.0.0.1:3000/products?name=';DELETE FROM purchase_items WHERE product_id=13;COMMIT;--
         */

        /* vulnerable implementation: raw SQL query */
        /*let filter = ""
        if (req.query.hasOwnProperty('name')) {
            filter = 'WHERE title = \'' + req.query['name'] + '\'';
        }

        const sqlquery = `SELECT * FROM products ${filter}`;
        console.log(sqlquery);
        db.query(sqlquery)*/

        /* solution 1: PL/pgSQL function */
        let pname = "";
        if (req.query.hasOwnProperty('name')) {
            pname = req.query['name'];
        }

        db.get_products(pname)

        /* solution 2: parameterised query */
        /*let params = {};
        for (var param in req.query) {
            if (req.query.hasOwnProperty(param)) {
                params[param] = req.query[param];
            }
        }

        db.products.find(params, {
            fields: ['title', 'price'],
            order: [{
                field: 'created_at',
                direction: 'desc',
            }]
        })*/

        /* promise fulfillment/rejection,
         * common to all three approaches
         */
        .then(dbresult => {
            res.status(200).send(dbresult)
        })
        .catch((err) => res.status(404).send(err));
    }).catch((err) => res.send(err));
});

app.get('/products/:id', (req, res) => {
    massive.then(db => {
      db.products.findOne(req.params.id, {
          fields: ['title', 'price', 'tags'],
          order: [{
              field: 'created_at',
              direction: 'desc',
          }]
      })
      .then(dbresult => {
          res.status(200).send(dbresult)
      })
      .catch((err) => res.status(404).send());
  }).catch((err) => res.send(err));
});

app.get('/purchases', (req, res) => {
    massive.then(db => {
        db.purchases.find({},{
            fields: ['name', 'address', 'state', 'zipcode', 'user_id'],
            order: [{
                field: 'created_at',
                direction: 'desc',
            }]
        })
        .then(dbresult => {
            res.status(200).send(dbresult)
        })
        .catch((err) => res.status(404).send());
    }).catch((err) => res.send(err));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});


