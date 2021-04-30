type int32 = number;

export class XorShift {
  static MIN_INTEGER: int32 = 0;
  static MAX_INTEGER: int32 = (2 ** 32 - 1) | 0;
  private _inc: int32;
  private _seed: int32;

  constructor(seed: number, inc: number) {
    this._seed = seed | 0;
    this._inc = inc | 0;
  }

  static new_random() {
    return XorShift.from_seed(random_int(2 ** 10, 2 ** 31));
  }

  static from_seed(seed: number) {
    return new XorShift(seed | 0, seed | 0);
  }

  get seed() {
    return this._seed;
  }

  get inc() {
    return this._inc;
  }

  reseed(seed: number) {
    this._seed = seed | 0;
    this._inc = seed;
  }

  clone() {
    return new XorShift(this._seed, this._inc);
  }

  next(): int32 {
    let t = this._seed;

    t ^= (t | 0) << 13;
    t ^= (t | 0) << 25;
    t ^= (t | 0) << 9;
    this._inc = (this._inc + 1368297235087925) | 0;

    t = Math.abs((t + this._inc) | 0);
    this._seed = t;
    return t;
  }

  random() {
    return 2 ** -31 * this.next();
  }

  random_integer(min: number, max: number) {
    return min + Math.floor(this.random() * (max - min));
  }

  random_choice<A>(xs: A[]): A | null {
    if (xs.length === 0) {
      return null;
    } else {
      const choice = this.random_integer(0, xs.length);
      return xs[choice];
    }
  }

  random_choice_mut<A>(xs: A[]): A | null {
    if (xs.length === 0) {
      return null;
    } else {
      const choice = this.random_integer(0, xs.length);
      const result = xs[choice];
      xs.splice(choice, 1);
      return result;
    }
  }

  random_choice_many<A>(size: number, xs: A[]): A[] {
    const result = [];
    const candidates = xs.slice();
    while (result.length < size) {
      const entry = this.random_choice_mut(candidates);
      if (entry == null) {
        return result;
      } else {
        result.push(entry);
      }
    }
    return result;
  }

  random_weighted_choice<A>(xs: [number, A][]): A | null {
    if (xs.length === 0) {
      return null;
    } else {
      let total = 0;
      for (const [x, _] of xs) {
        total += x;
      }
      const sorted_xs = xs.sort(([x1, _1], [x2, _2]) => x2 - x1);
      let choice = this.random_integer(0, total);
      for (const [score, item] of sorted_xs) {
        if (choice <= score) {
          return item;
        } else {
          choice -= score;
        }
      }
    }

    throw new Error(`internal: weighted choice picked none`);
  }
}

function random_int(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}
