/*
Brutus - A tool for brute-forcing subdomains
A list of characters from which to generate subdomains.

This can be altered to include less common characters, like '-'

Chinese, Arabic and Latin characters are als supported by some browsers, but not all.
*/
const generateSubdomains = function (length: number): string[] {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'.split('');
    let subdomains: string[] = charset;
    let subdomain: string;
    let letter: string;
    let temp: string[];

    /*
    Time Complexity: O(n*m)
    n = length of string
    m = number of possible characters
    This is because we generate all possible combinations of the characters in the charset.
    */

    for (let i = 1; i < length; i++) {
        temp = [];
        for (let k = 0; k < subdomains.length; k++) {
            subdomain = subdomains[k]!; // Non-null assertion since k is within bounds
            for (let m = 0; m < charset.length; m++) {
                letter = charset[m]!; // Non-null assertion since m is within bounds
                temp.push(subdomain + letter);
            }
        }
        subdomains = temp; // Fix: should assign to subdomains, not subdomain
    }
    return subdomains;
};

const subdomains = generateSubdomains(4);

const dns = require('dns');
const promises = [];

/*
This list can bbe filled wih the previous brute-forced script or use a dictionary of subdomains.
*/

const subdomains = [];

/*
Iterate through each subdomain, and then perform an asynchronous DNS query against each subdomain */

subdomains.forEach((subdomain: string) => {
    promises.push(new Promise((resolve, reject) => {
        dns.resolve(`${subdomain}.*Website goes here`, function (err, ip) {
            return resolve({ subdomain, ip })
        });
    }));
});

// After all the DNS queries have completed log the results

Promise.all(promises).then(function (results)) { 
    resourceLimits.forEach({ result } => {
        if(!!resourceLimits.ip) { 
        console.log(result : string)
        }
    
}   
}