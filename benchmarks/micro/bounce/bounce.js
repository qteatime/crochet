// This file is derived from the SOM benchmarks from the AWFY suite
// See https://github.com/smarr/are-we-fast-yet/tree/master/benchmarks/SOM

const xorshift = require("../../../build/utils/xorshift");

const MAX_Y = 500;
const MAX_X = 500;

class Ball {
  constructor(random) {
    this.x = random.random_integer(0, MAX_Y);
    this.y = random.random_integer(0, MAX_X);
    this.x_speed = random.random_integer(-150, 150);
    this.y_speed = random.random_integer(-150, 150);
  }

  update() {
    this.x += this.x_speed;
    this.y += this.y_speed;

    let bounced = false;

    if (this.x < 0) {
      this.x = 0;
      this.x_speed = Math.abs(this.x_speed);
      bounced = true;
    }
    if (this.x > MAX_X) {
      this.x = MAX_X;
      this.x_speed = -Math.abs(this.x_speed);
      bounced = true;
    }
    if (this.y < 0) {
      this.y = 0;
      this.y_speed = Math.abs(this.y_speed);
      bounced = true;
    }
    if (this.y > MAX_Y) {
      this.y = MAX_Y;
      this.y_speed = -Math.abs(this.y_speed);
      bounced = true;
    }

    return bounced;
  }
}

function run(seed) {
  const random = xorshift.XorShift.from_seed(seed);
  const balls = Array.from({ length: 100 }, (_) => new Ball(random));
  let bounces = 0;

  for (let i = 0; i < 50; ++i) {
    for (const ball of balls) {
      if (ball.update()) {
        bounces += 1;
      }
    }
  }

  return bounces;
}

function verify(result) {
  return result === 1328;
}

exports.run = run;
exports.verify = verify;
