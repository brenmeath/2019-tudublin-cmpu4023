const crypto = require('crypto');
const http = require('http');

/* currently just a very primitive hmac generator
 * which prints the request body to stdout
 * for someone to then copy and use with their API testing program eg. cURL
 */
const args = process.argv;
if (process.argv[2] === undefined
    || process.argv[3] === undefined
    || process.argv[4] === undefined) {
    return console.log(
        "Usage: node req-body-generator.js <message-body> <secret_key> <access_token>");
}

const secret_key = process.argv[3];
const payload_str = process.argv[2];
const accessToken = process.argv[4];

let signature = crypto.createHmac('sha256', secret_key)
    .update(payload_str + accessToken)
    .digest('hex');

let body = JSON.stringify({
    payload: payload_str,
    hmac: signature
});

console.log(body);
