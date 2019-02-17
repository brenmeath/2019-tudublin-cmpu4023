const http = require('http');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

    res.status(200).send(help);
});

module.exports = (app, db) => {
    app.get( "/products", (req, res) => {
        db.products.findAll()
        .then(result => res.json(result))
        .catch((err) => res.send(err));
    });

    app.get( "/products/:id", (req, res) => {
        db.products.findById(req.params.id)
        .then(result => res.json(result))
        .catch((err) => res.send(err));
    });

    app.post("/products", (req, res) => {
        db.products.create({
            id:    req.body.id,
            title: req.body.title,
            price: req.body.price
        }).then(result => res.json(result))
        .catch((err) => res.send(err))
    });

    app.put( "/products/:id", (req, res) => {
        db.products.update({
            title: req.body.title,
            price: req.body.price
        },{
            where: {
                id: req.params.id
            }
        }).then(result => res.json(result))
        .catch((err) => res.send(err));
    });

    app.delete( "/products/:id", (req, res) => {
        db.products.destroy({
            where: {
            id: req.params.id
        }
    }).then(result => res.json(result))
    .catch((err) => res.send(err));
    });
};

app.set('port', port);

const server = http.createServer(app);
server.listen(port);
