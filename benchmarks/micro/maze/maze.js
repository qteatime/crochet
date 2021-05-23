const xorshift = require("../../../build/utils/xorshift");

const CUT = 0;
const WALL = 1;
const EXPOSED = 2;
const UNVISITED = 3;
const PATH = 4;
const BEGIN = 5;
const END = 6;

class Cell {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
  }
}

function maze(random, width, height) {
  const cells = Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => new Cell(x, y, UNVISITED))
  );
  return generate_maze(random, cells, width, height);
}

function distance(a, b) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return Math.sqrt(x ** 2 + y ** 2);
}

function adjacent(cells, cell) {
  return [
    cells[cell.y - 1]?.[cell.x],
    cells[cell.y]?.[cell.x + 1],
    cells[cell.y + 1]?.[cell.x],
    cells[cell.y]?.[cell.x - 1],
  ].filter((a) => a != null);
}

function is_adjacent(a, b) {
  return (
    (a.x === b.x && (a.y === b.y + 1 || a.y === b.y - 1)) ||
    (a.y === b.y && (a.x === b.x + 1 || a.x === b.x - 1))
  );
}

function cut(stack, cells, cell) {
  for (const x of adjacent(cells, cell).filter((c) => c.state === UNVISITED)) {
    x.state = EXPOSED;
    stack.push(x);
  }
  cell.state = CUT;
}

function generate_maze(random, grid, width, height) {
  let exposed = [];

  // Initialise
  const cells = grid.flat();
  let cell = random.random_choice(cells);
  cut(exposed, grid, cell);

  // Cut
  while (exposed.length > 0) {
    const cell = random.random_choice_mut(exposed);
    const cuts = adjacent(grid, cell).filter((c) => c.state === CUT).length;
    if (cuts === 1) {
      cut(exposed, grid, cell);
    } else {
      cell.state = WALL;
    }
  }

  // Trace
  const cuts = cells.filter((x) => x.state === CUT);
  const starts = random.random_choice_many(5, cuts);
  const goals = random
    .random_choice_many(20, cuts)
    .filter((c) => starts.some((s) => c !== s && !is_adjacent(c, s)))
    .slice(0, 5);

  const scored_ends = starts.flatMap((s) =>
    goals.map((g) => [distance(s, g), { start: s, goal: g }])
  );
  const { start, goal } = random.random_weighted_choice(scored_ends);
  start.state = BEGIN;
  goal.state = END;

  return grid;
}

function draw_cell(cell) {
  switch (cell.state) {
    case CUT:
      return "_";
    case PATH:
      return ".";
    case BEGIN:
      return "B";
    case END:
      return "E";
    case WALL:
      return "#";
    case EXPOSED:
      return "!";
    case UNVISITED:
      return "?";
  }
}

function draw(grid) {
  return (
    "\n" +
    grid.map((ys) => ys.map((c) => draw_cell(c)).join("")).join("\n") +
    "\n"
  );
}

function main(seed) {
  const random = xorshift.XorShift.from_seed(seed);
  const grid = maze(random, 20, 20);
  const repr = draw(grid);
  return repr;
}

function verify(result) {
  const expected = `
__#__#_##___#___#___
#_#_#____#_#__#___#_
#____#_##___#_##_#_#
__#_#____##____###__
_#_#_#_##_#_##_____#
_____B______#_#E##_#
_##_##_##_#____##___
_#_#____#_#_##___#_#
_#__#_##_#___#_##_#_
___#_#___#####____#_
_#____#_#_____#_##__
__#_#___#_#_##_#_#_#
_#__#_#____#________
__#__#?#_##_##_#_#_#
#_#_#_#_##______#__#
#_#________###_#_#__
__#_##_##_#___#__#_#
_#____#_#__#_#__#_#?
_##_#_#___##___#___#
__#__#__#____#___#__
`;

  return result === expected;
}

exports.run = main;
exports.verify = verify;

main(218379128);
