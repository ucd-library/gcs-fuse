const env = process.env;

let buckets = env.BUCKETS;
if (buckets) {
  let map = {};
  buckets.split(',')
    .map(bucket => bucket.trim())
    .forEach(bucket => {
      let [name, path] = bucket.split(':');
      map[name] = path;
    });
  buckets = map;
}

const config = {

  port : env.PORT || 3000,

  buckets,

}

module.exports = config;