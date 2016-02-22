// adapted from https://github.com/ParsePlatform/parse-server/blob/master/src/cryptoUtils.js

var crypto = require('crypto');

// Returns a new random hex string of the given even size.
function randomHexString(size) {
  return crypto.randomBytes(size / 2).toString('hex');
}

// Returns a new random alphanumeric string of the given size.
//
// Note: to simplify implementation, the result has slight modulo bias,
// because chars length of 62 doesn't divide the number of all bytes
// (256) evenly. Such bias is acceptable for most cases when the output
// length is long enough and doesn't need to be uniform.
function randomString(size) {
  var chars = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
               'abcdefghijklmnopqrstuvwxyz' +
               '0123456789');
  var objectId = [];
  var bytes = crypto.randomBytes(size);
  for (var i = 0; i < bytes.length; ++i) {
    objectId.push(chars[bytes.readUInt8(i) % chars.length]);
  }
  return objectId.join('');
}

// Returns a new random alphanumeric string suitable for object ID.
module.exports = {
  randomId: () => {
    //TODO: increase length to better protect against collisions.
    return randomString(8);
  }
};