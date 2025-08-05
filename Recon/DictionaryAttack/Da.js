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

import dns from 'dns';
import csv from 'csv-parser';
import fs from 'fs';

const promises = [];

fs.readFileSync('subdomains10000.txt')
    .pipe(csv())
    .on('data', (subdomain) => {
        console.log(`Checking: ${subdomain}`);
        promises.push(new Promise((resolve, reject) => {
            dns.resolve(`${subdomain}.mega-bank.comf`, function (err, ip) {
                if (err) {
                    return resolve({ subdomain: subdomain, ip: null, error: err.code });
                }
                return resolve({ subdomain: subdomain, ip: ip });
            });
        }));
    })
    .on('end', () => {
        Promise.all(promises).then(function (results) {
            results.forEach((result) => {
                if(!!result.ip) {
                    console.log(result)
                };
            });
        });
    });
    // After all DNS queries have completed, log the results.

