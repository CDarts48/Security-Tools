// Our script has a simple purpose: using a given endpoint (we know this endpoint already accepts at least one HTTP verb), try each additional HTTP Verb. After each additional HTTP verb is tried against the endpoint, record and print the result:
const https = require('https');
const http = require('http');

const discoverHTTPVerbs = function (url) { 
    const verbs = ['OPTIONS','POST', 'GET', 'PATCH', 'DELETE',]
    const promises = [];

    verbs.forEach((verb) => {
        const promise = new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: urlObj.hostname,
                poer
            }
// If the request is successful, resolve the promise and include the status code in the result.
            http.open(verb, url, true)
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function () {
                if (http.readyState === 4) {
                    return resolve({ verb: verb });
                }
            }

// If the request is not successful, or does not complete in time, mark the request as unsuccessful. 
// The time out should be tweaked if need be.
            setTimeout(() => {
                return resolve({ verb: verb, status: -1 });
            },
                1000);
            http.send({})
        });
        promises.push(promise);
    });
// When all verbs have been attempted, log the results of their respective promises to the console.
    Promise.all(promises).then(function (values) {
        console.log(values);
    });
}

discoverHTTPVerbs('https://cdartswebdev.com');