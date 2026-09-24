import GameController from '../js/GameController';
import GamePlay from '../js/GamePlay';

describe('GameController.loadGame', () => {
  let gamePlayMock;
  let stateServiceMock;
  let controller;

  beforeEach(() => {
    gamePlayMock = {
      boardSize: 8,
      drawUi: jest.fn(),
      redrawPositions: jest.fn(),
      addCellEnterListener: jest.fn(),
      addCellLeaveListener: jest.fn(),
      addCellClickListener: jest.fn(),
      addNewGameListener: jest.fn(),
      addSaveGameListener: jest.fn(),
      addLoadGameListener: jest.fn(),
    };
    stateServiceMock = {
      save: jest.fn(),
      load: jest.fn(),
    };
    controller = new GameController(gamePlayMock, stateServiceMock);
  });

  test('успешная загрузка восстанавливает состояние без вызова showError', () => {
    jest.spyOn(GamePlay, 'showError').mockImplementation(() => {});
    stateServiceMock.load.mockReturnValue({
      level: 2,
      currentPlayer: 'player',
      maxScore: 12,
      locked: false,
      positions: [
        { type: 'bowman', level: 2, attack: 25, defence: 25,health: 50, position: 0 },
      ],
    });

    const result = controller.loadGame(true);

    expect(result).toBe(true);
    expect(controller.level).toBe(2);
    expect(GamePlay.showError).not.toHaveBeenCalled();

    GamePlay.showError.mockRestore();
  });

  test('неуспешная загрузка вызывает showError', () => {
    jest.spyOn(GamePlay, 'showError').mockImplementation(() => {});
    stateServiceMock.load.mockImplementation(() => {
      throw new Error('данные повреждены');
    });

    const result = controller.loadGame(true);

    expect(result).toBe(false);
    expect(GamePlay.showError).toHaveBeenCalledWith('Не удалось загрузить сохранённую игру');

    GamePlay.showError.mockRestore();
  });

  test('неуспешная загрузка без флага showErrorOnFail не вызывает showError', () => {
    jest.spyOn(GamePlay, 'showError').mockImplementation(() => {});
    stateServiceMock.load.mockImplementation(() => {
      throw new Error('нет сохранения');
    });

    const result = controller.loadGame(false);

    expect(result).toBe(false);
    expect(GamePlay.showError).not.toHaveBeenCalled();

    GamePlay.showError.mockRestore();
  });

  test('отсутствие сохранения не считается ошибкой', () => {
  jest.spyOn(GamePlay, 'showError').mockImplementation(() => {});
  stateServiceMock.load.mockReturnValue(null);

  const result = controller.loadGame(true);

  expect(result).toBe(false);
  expect(GamePlay.showError).not.toHaveBeenCalled();

  GamePlay.showError.mockRestore();
});
});