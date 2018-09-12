'use strict'
const AWS = require('aws-sdk')
let options = {}
if (process.env.IS_OFFLINE) {
  options = {
    accessKeyId: 'myAccesskey',
     secretAccessKey: 'mySecretkey',
     region: 'us-east-1',
    endpoint: 'http://localhost:8000'
  }
}
const client = new AWS.DynamoDB.DocumentClient(options)
module.exports = client