//exports.stats = {
//var stats = function
//distribution: function() {},

//statsjs.prototype.pdf = function(){};

//TODO
// 2. add more distributions
//    Discrete:
//       a. binomial
//    Continious.
//       - poisson
//       - laplace
//       - exponential
//       - pareto
//       - beta

exports.normal = normal; 
exports.uniform = uniform;

function normal(mean,variance) {

  mean = typeof mean !== 'undefined' ? mean : 0;
  variance = typeof variance !== 'undefined' ? variance : 1;
  this.mean = mean;
  this.var = variance;

  this.pdf = function(x) {
    a = 1/(this.var*Math.sqrt(2*Math.PI));
    return a*Math.pow(Math.E,-Math.pow((x-this.mean),2)/(2*Math.pow(this.var,2)));
  }
  this.cdf = function(x){
    return (1+erf_series((x-this.mean)/(this.var*Math.sqrt(2)),25))/2
  }

  this.quantile = function(s){
    if (s>1 || s<0){
      return Number.NaN
    }
    if (s == .5){
      return this.mean
    }
    return this.mean+this.var*Math.sqrt(2)*inverse_erf(2*s - 1)
  }

  this.rand = function(iters){
    iters = typeof iters !== 'undefined' ? iters : 1;
    if (iters>1){
      arr = new Array;
      for (i=0;i<iters;i++){
        arr.push(this.quantile(Math.random()))
      }
      return arr
    }
    return this.quantile(Math.random())
  }

  return this;
}

normal.fit = function(data){
  mean = get_mean(data);
  variance = get_variance(data,mean);
  return normal(mean,variance)
}

function get_variance(data,mean){
  variance = 0;
  for (j=0;j<data.length;j++){
    variance += Math.pow(mean-data[j],2);
  }
  return variance/(data.length-1);

}

function get_mean(data){
  total = 0;
  for (i=0;i<data.length;i++){
    total += data[i]
  }
  return  total/data.length
}


function erf_series(x,n){
  total = 0;
  for (k=0;k<n;k++){
    total += erf_term(x,k);
  }
  return total;
}

function erf_term(x,k){
  return 2*Math.pow(-1,k)*Math.pow(x,1+2*k)/((1+2*k)*factorial(k)*Math.sqrt(Math.PI))
}

var f = [];
function factorial (n) {
  if (n == 0 || n == 1)
    return 1;
  if (f[n] > 0)
    return f[n];
  return f[n] = factorial(n-1) * n;
}

function inverse_erf(x){
  a = 8*(Math.PI - 3)/(3*Math.PI*(4-Math.PI))
  term1 = Math.pow((2/(Math.PI*a)) + Math.log(1-Math.pow(x,2))/2,2) - Math.log(1-Math.pow(x,2))/a
  term2 = (2/(Math.PI*a)) + Math.log(1-Math.pow(x,2))/2
  return (Math.abs(x)/x)*Math.sqrt(Math.sqrt(term1)-term2) 
}

function uniform(a,b){
  a = typeof a !== 'undefined' ? a : 0;
  b = typeof b !== 'undefined' ? b : 1;
  this.a = a;
  this.b = b;
  this.mean = (this.a + this.b)/2;
  this.variance = Math.pow(this.b - this.a,2)/12

  this.pdf = function(x){
    if (x>a && x<b){ 
      return 1/(this.b-this.a)
    }
    return 0
  }

  this.cdf = function(x){
    if (x<this.a){
      return 0
    }
    if (x<this.b){
      return (x-this.a)/(this.b-this.a)
    }
    if (x>=this.b){
      return 1
    }
  }

  this.quantile = function(x){
    return x*(this.b-this.a)+this.a
  }

  this.rand = function(n){
    n = typeof n !== 'undefined' ? n : 1;
    if (n>1){
      arr = new Array;
      for (i=0;i<n;i++){
        arr.push(this.a + (this.b - this.a)*Math.random());
      }
      return arr;
    }
    return this.a + (this.b - this.a)*Math.random()
  }
  return this
}

uniform.fit = function(data){
  midrange = (max(data)+min(data))/2;
  range = max(data)-min(data);
  a = midrange - (range/2);
  b = midrange + (range/2);
  return uniform(a,b)
}
function max(data){
  return Math.max.apply(null, data);
}

function min(data){
  return Math.min.apply(null, data);
}


