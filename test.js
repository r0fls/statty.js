stats = require('./stats.js')
console.log(stats.laplace(400,19).variance)
l = stats.laplace.fit([400,399,401]);
console.log(l.mean)
