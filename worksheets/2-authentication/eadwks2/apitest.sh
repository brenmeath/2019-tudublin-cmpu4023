#!/bin/sh

CURL="curl -s -H Content-Type:application/json"
API_ROOT=http://localhost:3000


# $CURL -X GET $API_ROOT/products

echo "Doing a POST request"
# create a new item in db and extract the item id from server response
TMP_RESULT=$($CURL -X POST \
    -d '{"title":"dustpan and brush","price_euro":"8.99"}' \
    $API_ROOT/products \
    )
echo $TMP_RESULT

# extract ID of the object created via POST request
ROW_ID=$(echo $TMP_RESULT | jq -r '.id')

echo "Doing a GET request"
$CURL -X GET $API_ROOT/products/$ROW_ID
echo ""

echo "Doing a PUT request"
$CURL -X PUT \
    -d '{"title":"dustpan and brush", "price_euro":"9.99"}' \
    $API_ROOT/products/$ROW_ID
echo ""

echo "Doing a PATCH request"
$CURL -X PATCH \
    -d '{"price_euro":"12.99"}' \
    $API_ROOT/products/$ROW_ID
echo ""

echo "Doing a DELETE request"
$CURL -X DELETE \
    $API_ROOT/products/$ROW_ID
echo ""
