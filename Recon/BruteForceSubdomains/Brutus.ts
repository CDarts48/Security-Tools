/*
Brutus - A tool for brute-forcing subdomains
A list of characters from which to generate subdomains.

This can be altered to include less common characters, like '-'

Chinese, Arabic and Latin characters are als supported by some browsers, but not all.
*/
const generateSubdomains = function(length) {
const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-'.split('');
let subdomains = charset;
let subdomain;
let letter;
let temp;

/*
Time Complexity: O(n*m)
n = length of string
m = number of possible characters
This is because we generate all possible combinations of the characters in the charset.
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
    subdomain = temp
}
return subdomains;
}

const subdomains = generateSubdomains(4)

