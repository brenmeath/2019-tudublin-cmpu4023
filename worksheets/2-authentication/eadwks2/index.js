const express = require('express');
const bodyParser = require('body-parser');
const Massive = require('massive');

const app = express();
const port = 3000;

require('dotenv').config();

const massive = Massive({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	ssl: process.env.DB_SSL,
	poolSize: process.env.DB_POOLSIZE
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	let help = {
		"Available API endpoints": {
		"GET /products": "List all products",
		"GET /products/<id>": "List product with given ID",
		"POST /products": "Create a new product",
		"PUT /products/<id>": "Update an existing product",
		"DELETE /products/<id>": "Delete a product"
		}
	};

	res.status(200).json(help);
});

app.get('/products', (req, res) => {
    massive.then(db => {
	    db.products.find({}, {
            fields: ['id', 'title', 'price_euro']
        })
	    .then(dbresult => {
		    res.status(200).json(dbresult)
	    })
	    .catch((err) => {
		    res.status(404).send();
		    console.log(err);
	    });
    })
    .catch((err) => {
	    res.status(500).send();
	    console.log(err);
    });
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
