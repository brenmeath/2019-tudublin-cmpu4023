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
		    res.status(200).json(dbresult);
	    })
	    .catch((err) => {
		    res.status(500).send();
		    console.log(err);
	    });
    })
    .catch((err) => {
	    res.status(500).send();
	    console.log(err);
    });
});

app.get('/products/:id', (req, res) => {
    massive.then(db => {
	    db.products.findOne(req.params.id, {
            fields: ['id', 'title', 'price_euro']
        })
	    .then(dbresult => {
		    res.status(200).json(dbresult);
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

app.post('/products', (req, res) => {
    massive.then(db => {
        // ensure that all NOT NULL columns are defined
        if (req.body.title === undefined || req.body.price_euro === undefined) {
            res.status(400).send();
        } else {
	        db.products.insert({
	            title: req.body.title,
	            price_euro: req.body.price_euro
            })
	        .then(dbresult => {
		        res.status(201).json(dbresult);
	        })
	        .catch((err) => {
		        res.status(500).send();
		        console.log(err);
	        });
        }
    })
    .catch((err) => {
	    res.status(500).send();
	    console.log(err);
    });
});

app.put('/products/:id', (req, res) => {
    massive.then(db => {
        // ensure that all NOT NULL columns are defined
        if (req.body.title === undefined || req.body.price_euro === undefined) {
            res.status(400).send();
        } else {
	        db.products.update({
	            id: req.params.id
            },
            {
	            title: req.body.title,
	            price_euro: req.body.price_euro
            })
	        .then(dbresult => {
		        res.status(200).json(dbresult);
	        })
	        .catch((err) => {
		        res.status(500).send();
		        console.log(err);
	        });
        }
    })
    .catch((err) => {
	    res.status(500).send();
	    console.log(err);
    });
});

app.patch('/products/:id', (req, res) => {
    massive.then(db => {
        // ensure that all NOT NULL columns are defined
        if (req.body.title === undefined && req.body.price_euro === undefined) {
            res.status(400).send();
        } else {
            // figure out which columns are to be updated
            let newValues = {};
            if (req.body.title !== undefined) {
                newValues.title = req.body.title;
            }
            if (req.body.price_euro !== undefined) {
                newValues.price_euro = req.body.price_euro;
            }

	        db.products.update({
	            id: req.params.id
            },
            newValues)
	        .then(dbresult => {
		        res.status(200).json(dbresult);
	        })
	        .catch((err) => {
		        res.status(500).send();
		        console.log(err);
	        });
        }
    })
    .catch((err) => {
	    res.status(500).send();
	    console.log(err);
    });
});


app.delete('/products/:id', (req, res) => {
    massive.then(db => {
	    db.products.destroy({
            id: req.params.id
        })
	    .then(dbresult => {
		    res.status(200).json(dbresult);
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
