import {
  getRowCol, isValidMove, isInAttackRange, MOVE_RANGE, ATTACK_RANGE,
} from '../js/utils';

const boardSize = 8;

describe('getRowCol', () => {
  test('корректно вычисляет row/col по индексу', () => {
    expect(getRowCol(0, boardSize)).toEqual({ row: 0, col: 0 });
    expect(getRowCol(9, boardSize)).toEqual({ row: 1, col: 1 });
    expect(getRowCol(63, boardSize)).toEqual({ row: 7, col: 7 });
  });
});

describe('Движение персонажей', () => {
  const cases = [
    { type: 'swordsman', range: MOVE_RANGE.swordsman },
    { type: 'undead', range: MOVE_RANGE.undead },
    { type: 'bowman', range: MOVE_RANGE.bowman },
    { type: 'vampire', range: MOVE_RANGE.vampire },
    { type: 'magician', range: MOVE_RANGE.magician },
    { type: 'daemon', range: MOVE_RANGE.daemon },
  ];

  cases.forEach(({ type, range }) => {
    describe(`${type} (дальность хода ${range})`, () => {
      test('разрешает ход по прямой в пределах дальности', () => {
        const from = { row: 0, col: 0 };
        const to = { row: 0, col: range };
        expect(isValidMove(from, to, range)).toBe(true);
      });

      test('разрешает ход по диагонали в пределах дальности', () => {
        const from = { row: 0, col: 0 };
        const to = { row: range, col: range };
        expect(isValidMove(from, to, range)).toBe(true);
      });

      test('запрещает ход дальше допустимой дистанции', () => {
        const from = { row: 0, col: 0 };
        const to = { row: 0, col: range + 1 };
        expect(isValidMove(from, to, range)).toBe(false);
      });

      test('запрещает ход не по прямой и не по диагонали', () => {
        const from = { row: 0, col: 0 };
        const to = { row: 1, col: 2 };
        expect(isValidMove(from, to, range)).toBe(false);
      });

      test('запрещает ход в ту же клетку', () => {
        const from = { row: 3, col: 3 };
        const to = { row: 3, col: 3 };
        expect(isValidMove(from, to, range)).toBe(false);
      });
    });
  });
});

describe('Атака персонажей', () => {
  const cases = [
    { type: 'swordsman', range: ATTACK_RANGE.swordsman },
    { type: 'undead', range: ATTACK_RANGE.undead },
    { type: 'bowman', range: ATTACK_RANGE.bowman },
    { type: 'vampire', range: ATTACK_RANGE.vampire },
    { type: 'magician', range: ATTACK_RANGE.magician },
    { type: 'daemon', range: ATTACK_RANGE.daemon },
  ];

  cases.forEach(({ type, range }) => {
    describe(`${type} (радиус атаки ${range})`, () => {
      test('разрешает атаку по прямой в пределах радиуса', () => {
        const from = { row: 0, col: 0 };
        const to = { row: 0, col: range };
        expect(isInAttackRange(from, to, range)).toBe(true);
      });

      test('разрешает атаку по диагонали в пределах радиуса', () => {
        const from = { row: 0, col: 0 };
        const to = { row: range, col: range };
        expect(isInAttackRange(from, to, range)).toBe(true);
      });

      test('запрещает атаку за пределами радиуса', () => {
        const from = { row: 0, col: 0 };
        const to = { row: 0, col: range + 1 };
        expect(isInAttackRange(from, to, range)).toBe(false);
      });

      test('запрещает атаку по собственной клетке', () => {
        const from = { row: 3, col: 3 };
        const to = { row: 3, col: 3 };
        expect(isInAttackRange(from, to, range)).toBe(false);
      });
    });
  });
});