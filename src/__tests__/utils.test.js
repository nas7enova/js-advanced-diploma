import { calcTileType } from '../js/utils';

describe('calcTileType', () => {
  const boardSize = 8;

  test('возвращает top-left для индекса 0', () => {
    expect(calcTileType(0, boardSize)).toBe('top-left');
  });

  test('возвращает top-right для последнего элемента первой строки', () => {
    expect(calcTileType(7, boardSize)).toBe('top-right');
  });

  test('возвращает top для элемента в середине первой строки', () => {
    expect(calcTileType(3, boardSize)).toBe('top');
  });

  test('возвращает left для первого элемента второй строки', () => {
    expect(calcTileType(8, boardSize)).toBe('left');
  });

  test('возвращает right для последнего элемента второй строки', () => {
    expect(calcTileType(15, boardSize)).toBe('right');
  });

  test('возвращает center для ячейки в середине поля', () => {
    expect(calcTileType(27, boardSize)).toBe('center');
  });

  test('возвращает bottom-left для первого элемента последней строки', () => {
    expect(calcTileType(56, boardSize)).toBe('bottom-left');
  });

  test('возвращает bottom-right для последнего элемента последней строки', () => {
    expect(calcTileType(63, boardSize)).toBe('bottom-right');
  });

  test('возвращает bottom для элемента в середине последней строки', () => {
    expect(calcTileType(59, boardSize)).toBe('bottom');
  });
});