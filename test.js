stats = require('./statty.js')
console.log(stats.geometric.fit(stats.geometric(.4).rand(1000)).mean)
