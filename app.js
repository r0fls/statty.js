var stats = require('./stats.js')
normal = stats.normal();
console.log(stats.normal().quantile(.999))
