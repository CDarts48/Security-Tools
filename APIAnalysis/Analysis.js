// Our script has a simple purpose: using a given endpoint (we know this endpoint already accepts at least one HTTP verb), try each additional HTTP Verb. After each additional HTTP verb is tried against the endpoint, record and print the result:
import https from 'https';
import http from 'http';
import { resolve } from 'path';
import { rejects } from 'assert';

const discover = function (url) { 
    const verbs = ['OPTIONS', 'GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'HEAD'];
    const promises = [];

    verbs.forEach((verb) => {
        const promise = new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname,
                method: verb,
                timeout: 5000,
                headers: {
                    'User-Agent': 'HTTP-Verb-Discovery-Tool'
                }
            };

            const req = client.request(options, (res) => {
                resolve({ 
                    verb: verb, 
                    status: res.statusCode, 
                    headers: res.headers,
                    allowed: res.statusCode < 405 
                });
            });

            req.on('error', (err) => {
                resolve({ 
                    verb: verb, 
                    status: -1, 
                    error: err.message 
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({ 
                    verb: verb, 
                    status: -1, 
                    error: 'timeout' 
                });
            });

            req.end();
        });
        promises.push(promise);
    });

    Promise.all(promises).then(function (results) {
        console.log('\n=== HTTP Verb Discovery Results ===');
        results.forEach(result => {
            const status = result.status === -1 ? 'FAILED' : result.status;
            const allowed = result.status > 0 && result.status < 405 ? '✓' : '✗';
            console.log(`${allowed} ${result.verb.padEnd(8)} : ${status}`);
        });
        
        // Show OPTIONS response if available
        const optionsResult = results.find(r => r.verb === 'OPTIONS');
        if (optionsResult && optionsResult.headers && optionsResult.headers.allow) {
            console.log(`\nServer-reported allowed methods: ${optionsResult.headers.allow}`);
        }
    });
};

// Test against your target can use both just change to https
discover('https://tophersmandr.com');


const discoverWithRedirects = function (url) {
    console.log(`\nTesting redirects for: ${url}`);
    
    const verbs = ['OPTIONS', 'GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'HEAD'];
    const promises = [];

    verbs.forEach((verb) => {
        const promise = new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname,
                method: verb,
                timeout: 5000,
                headers: {
                    'User-Agent': 'HTTP-Verb-Discovery-Tool'
                },
                // Follow redirects
                maxRedirects: 5
            };

            const req = client.request(options, (res) => {
                let redirectUrl = null;
                if (res.statusCode >= 300 && res.statusCode < 400) {
                    redirectUrl = res.headers.location;
                }
                
                resolve({ 
                    verb: verb, 
                    status: res.statusCode, 
                    headers: res.headers,
                    redirectUrl: redirectUrl,
                    allowed: res.statusCode < 405 
                });
            });

            req.on('error', (err) => {
                resolve({ 
                    verb: verb, 
                    status: -1, 
                    error: err.message 
                });
            });

            req.end();
        });
        promises.push(promise);
    });

    Promise.all(promises).then(function (results) {
        console.log('\n=== Redirect Analysis ===');
        results.forEach(result => {
            console.log(`${result.verb.padEnd(8)} : ${result.status} → ${result.redirectUrl || 'No redirect'}`);
        });
        
        // Test the redirect destination
        const firstRedirect = results.find(r => r.redirectUrl);
        if (firstRedirect) {
            console.log(`\nTesting redirect destination: ${firstRedirect.redirectUrl}`);
            setTimeout(() => discover(firstRedirect.redirectUrl), 1000);
        }
    });
};

// Test the redirect behavior
discoverWithRedirects('https://tophersmandr.com');