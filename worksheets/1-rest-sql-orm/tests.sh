#!/bin/bash

PORT=3000

# 1
curl -s -X GET -H 'Accept: application/json' http://localhost:$PORT/products

# 2
curl -s -X GET -H 'Accept: application/json' http://localhost:$PORT/products/19

# 3
curl -s -X POST -H 'Accept: application/json' http://localhost:$PORT/products -d '{"id": "8001","title":"dust pan and brush", "price":"5.99"}'

# 4
curl -s -X PUT -H 'Accept: application/json' http://localhost:$PORT/products/8001 -d '{"id": "8001","title":"dust pan and brush", "price":"7.99"}'

# 5
curl -X DELETE http://localhost:$PORT/products/8001
