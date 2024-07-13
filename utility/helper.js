const crypto = require('crypto');
function sha256Hash(password, salt) {
    const hash = crypto.createHash('sha256');
    hash.update(password + salt);
    return hash.digest('hex');
}

module.exports = {sha256Hash};