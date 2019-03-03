const express = require('express');
const bodyParser = require('body-parser');
const Massive = require('massive');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secret key for HMAC signed request
app.set('hmacSecret', 'triangle');
// secret key for creating access tokens
app.set('jwtSecret', 'balloons');

/* checks for existence of and verifies the client bearer token.
 * If token is invalid or not found, we send a status 401 response.
 */
const verifyToken = (req, res, next) => {
    if(typeof req.headers['authorization'] !== 'undefined') {
        req.token = req.headers['authorization'].split(' ')[1];
        jwt.verify(req.token, req.app.get('jwtSecret'), (err, authData) => {
            if (err) {
                res.status(401).send();
            } else {
                next();
            }
        });
    } else {
        res.status(401).send();
    }
}

function verifyHmac(req) {
    const computed_signature = crypto.createHmac('sha256', req.app.get('hmacSecret'))
        .update(req.body.payload + req.token)
        .digest('hex');

    if (computed_signature != req.body.hmac) {
        console.log('signature mismatch');
        return false;
    }

    console.log('signatures match');
    return true;
}

app.get('/', (req, res) => {
	let help = {
		"Available API endpoints": {
		"POST /auth": "Acquire an API access token using email and password",
		"GET /products": "List all products",
		"GET /products/<id>": "List product with given ID",
		"POST /products": "Create a new product",
		"PUT /products/<id>": "Update an existing product",
		"DELETE /products/<id>": "Delete a product"
		}
	};

	res.status(200).json(help);
});

app.post('/auth', (req, res) => {
    massive.then(db => {
        db.user_login(req.body.email, req.body.password)
        .then(dbresult => {
            console.log(dbresult);
            if (dbresult.length) {
                const tok = jwt.sign({id: dbresult[0].id},
                    req.app.get('jwtSecret'),
                    {expiresIn: '1h'}
                );
                res.status(200).json(tok);
            } else {
                res.status(401).send();
            }
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

app.get('/products', verifyToken, (req, res) => {
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

app.get('/products/:id', verifyToken, (req, res) => {
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

app.post('/products', verifyToken, (req, res) => {
    if (verifyHmac(req)) {
        let payload = JSON.parse(req.body.payload);
        massive.then(db => {
            // ensure that all NOT NULL columns are defined
            if (payload.title === undefined || payload.price_euro === undefined) {
                res.status(400).send();
            } else {
	            db.products.insert({
	                title: payload.title,
	                price_euro: payload.price_euro
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
    } else {
        res.status(401).send();
    }
});

app.put('/products/:id', verifyToken, (req, res) => {
    if (verifyHmac(req)) {
        let payload = JSON.parse(req.body.payload);
        massive.then(db => {
            // ensure that all NOT NULL columns are definedls -
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
		            res.status(201).json(dbresult);
	            })
	            .catch((err) => {
		            res.status(404).send();
		            console.log(err);
	            });
            }
        })
        .catch((err) => {
	        res.status(500).send();
	        console.log(err);
        });
    } else {
        res.status(401).send();
    }
});

app.patch('/products/:id', verifyToken, (req, res) => {
    if (verifyHmac(req)) {
        let payload = JSON.parse(req.body.payload);
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
		            res.status(201).json(dbresult);
	            })
	            .catch((err) => {
		            res.status(404).send();
		            console.log(err);
	            });
            }
        })
        .catch((err) => {
	        res.status(500).send();
	        console.log(err);
        });
    } else {
        res.status(401).send();
    }
});

app.delete('/products/:id', verifyToken, (req, res) => {
    if (verifyHmac(req)) {
        let payload = JSON.parse(req.body.payload);
        massive.then(db => {
	        db.products.destroy({
                id: req.params.id
            })
	        .then(dbresult => {
		        res.status(204).json(dbresult);
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
    } else {
        res.status(401).send();
    }
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
