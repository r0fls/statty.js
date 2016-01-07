//exports.stats = {
//var stats = function
//distribution: function() {},

//statsjs.prototype.pdf = function(){};

exports.normal = function(mean,variance){

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
  return this;
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

