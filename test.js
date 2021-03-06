stats = require('./statty.js')
console.log('Test Binomial: '+stats.binomial(3,.3).rand(10))
console.log('Test Uniform (0): '+stats.uniform.fit(stats.uniform(0,2).rand(10)).a)
console.log('Test Laplace (3): '+stats.laplace.fit(stats.laplace(3,1).rand(10)).mean)
console.log('Test Normal (3): '+stats.normal.fit(stats.normal(3,.3).rand(10)).mean)
console.log('Test Bernoulli (.5): '+stats.bernoulli.fit(stats.bernoulli(.5).rand(10)).mean)
console.log('Test Poisson (3): '+stats.poisson.fit(stats.poisson(3).rand(10)).mean)
console.log('Test Pareto (2.25): '+stats.pareto.fit(stats.pareto(10,1.5).rand(10)).mean)
console.log('Test geometric (3): '+stats.geometric.fit(stats.geometric(.33).rand(100)).mean)
//obj = Object.create(stats.geometric(.4))
//console.log(obj.mean);
