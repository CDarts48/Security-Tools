/**
 * Begin steaming the subdomain data from disk 
 * (versus pulling it all into memory at once, in case it is a large file)
 * 
 * On each line, call 'dns.resolve' to query the subdomain and check if it exists.
 * store these promises in the 'promises' array.
 * 
 * When all lines have been red, and all promises have been resolved, then log the subdomains found to the console.
 * 
 * Performance Upgrade: if the subdomains list is execptionally large.
 * then a second file should be opened and the results should be 
 * streamed to that file whenever a promise resolved.
 */

const dns = require('dns');
const csv = require('csv-parser');
const fs = require('fs');

const promises = [];

fs.createReadStream()

