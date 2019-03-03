const crypto = require('crypto');
const http = require('http');

/* currently just a very primitive hmac generator
 * which echoes the request body to stdout
 * for someone to then copy
 * and use with their API testing program eg. cURL
 */

const secret_key = 'triangle';

let payload_str = JSON.stringify({"title":"bicycle tube","price_euro":"3.99"});
let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQxZGNjZWU5LWM3Y2YtNDVhOS1iYzNkLTk5MjU1NzhiYjJlOSIsImlhdCI6MTU1MTY1Mjc4NSwiZXhwIjoxNTUxNjU2Mzg1fQ.v7rArRyBivE7odOBkAgE52xN5KeRyG2VqWrZPUtfyJQ';

let signature = crypto.createHmac('sha256', secret_key)
    .update(payload_str + accessToken)
    .digest('hex');

let body = JSON.stringify({
    payload: payload_str,
    hmac: signature
});

console.log(body);
