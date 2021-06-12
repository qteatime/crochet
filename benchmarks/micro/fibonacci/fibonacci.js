function fib(x) {
  if (x === 0n) {
    return 0n;
  } else if (x === 1n) {
    return 1n;
  } else {
    return fib(x - 1n) + fib(x - 2n);
  }
}

function run(_seed) {
  return fib(30n);
}

function verify(result) {
  return result === 832040n;
}

exports.run = run;
exports.verify = verify;
