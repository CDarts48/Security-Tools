// A simple function for brute forcing a list of subdomains given a maximum length of each subdomain
/**
A list of charcters from which to generate subdomains. 

This list can be altered to include less common characters like "-"

Chineese, Aribic and Latin charcters are also supported by some browsers. 
**/

import * as dns from 'dns';

function generateSubdomains(length: number): string[] {
    const charset = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    let subdomains: string[] = charset;
    let subdomain: any;
    let letter: any;
    let temp: string[];

    /**
     * Time Complexity: o(n*m)
     * n = length of string
     * m = number of valid characters
     */

    for (let i = 1; i < length; i++) {
        temp = [];
        for (let k = 0; k < subdomains.length; k++) {
            subdomain = subdomains[k];
            for (let m = 0; m < charset.length; m++) {
                letter = charset[m];
                temp.push(subdomain + letter);
            }
        }
        subdomains = temp;
    }
    return subdomains;
}

const subdomains = generateSubdomains(4);
const promises: any = [];

/**
 * Iterate through each subdomain, and preform an asynchronous DNS query against each subdomain.
 * 
 * This is much more performant than the more common 'dns.lookup()' because the 'dns.lookup' appears asynchronous from the javascript.
 * but relays on the operating system's getaddinfo(3), which is implemented synchronously.
 */

subdomains.forEach((subdomain) => {
    promises.push(new Promise((resolve, reject) => {
        dns.resolve(`${subdomain}.mega-bank.com`, function (err: any, ip: any) {
            if (err) {
                return reject(new Error(`DNS resolution failed for ${subdomain}': ${err.message}`));
            }
            return resolve({ subdomain: subdomain, ip: ip });
        });
    }));
});

/* Above put in the website you are looking for line 49 */

// after all of the DNS queries have completed, log the results

Promise.all(promises).then(function (results) {
    results.forEach((results) => {
        if (!!results.ip) {
            console.log(results);
        }
    });
});