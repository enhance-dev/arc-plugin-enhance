let readLocal = require('./_local')
let readS3 = require('./_s3')

module.exports = function read ({ env }) {
  let { ARC_ENV, ARC_LOCAL } = process.env
  let local = env === 'testing' || ARC_ENV === 'testing' || ARC_LOCAL
  return local ? readLocal : readS3
}
