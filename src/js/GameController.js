import themes from './themes';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import PositionedCharacter from './PositionedCharacter';
import {
	generateTeam
} from './generators';
import {
	characterInfo,
	MOVE_RANGE,
	ATTACK_RANGE,
	getRowCol,
	isValidMove,
	isInAttackRange,
} from './utils';
import GameState from './GameState';
import GamePlay from './GamePlay';
import cursors from './cursors';

const CHARACTER_CLASSES = {
	bowman: Bowman,
	swordsman: Swordsman,
	magician: Magician,
	vampire: Vampire,
	undead: Undead,
	daemon: Daemon,
};

export default class GameController {
	constructor(gamePlay, stateService) {
		this.gamePlay = gamePlay;
		this.stateService = stateService;
		this.level = 1;
		this.selectedIndex = undefined;

		this.onCellEnter = this.onCellEnter.bind(this);
		this.onCellLeave = this.onCellLeave.bind(this);
		this.onCellClick = this.onCellClick.bind(this);
	}

	init() {
		this.locked = false;
		this.addEventListeners();
		this.gamePlay.addNewGameListener(() => this.startNewGame());
		this.gamePlay.addSaveGameListener(() => this.saveState());
		this.gamePlay.addLoadGameListener(() => this.loadGame(true));

		const restored = this.loadGame(false);
		if (!restored) {
			this.gameState = new GameState();
			this.level = 1;
			this.startGame();
		}
	}

	startGame() {
		const playerTypes = [Bowman, Swordsman, Magician];
		const enemyTypes = [Vampire, Undead, Daemon];
		this.playerTypes = playerTypes;

		this.gamePlay.drawUi(this.getThemeByLevel(this.level));

		this.playerTeam = generateTeam(playerTypes, 1, 2);
		this.enemyTeam = generateTeam(enemyTypes, this.level, 2);

		const playerPositions = this.generatePositions([0, 1], this.playerTeam.characters.length);
		const enemyPositions = this.generatePositions([6, 7], this.enemyTeam.characters.length);

		const positionedCharacters = [
			...this.playerTeam.characters.map((character, index) => new PositionedCharacter(character, playerPositions[index])),
			...this.enemyTeam.characters.map((character, index) => new PositionedCharacter(character, enemyPositions[index])),
		];

		this.redrawPositions(positionedCharacters);
	}

	addEventListeners() {
		this.gamePlay.addCellEnterListener(this.onCellEnter);
		this.gamePlay.addCellLeaveListener(this.onCellLeave);
		this.gamePlay.addCellClickListener(this.onCellClick);
	}

	redrawPositions(positionedCharacters) {
		this.positionedCharacters = positionedCharacters;
		this.gamePlay.redrawPositions(positionedCharacters);
	}
	// TODO: load saved stated from stateService

	generatePositions(columns, count) {
		const {
			boardSize
		} = this.gamePlay;
		const availableCells = [];

		for (let row = 0; row < boardSize; row += 1) {
			columns.forEach((col) => {
				availableCells.push(row * boardSize + col);
			});
		}

		const shuffled = availableCells.sort(() => Math.random() - 0.5);
		return shuffled.slice(0, count);
	}

	getThemeByLevel(level) {
		switch (level) {
			case 1:
				return themes.prairie;
			case 2:
				return themes.desert;
			case 3:
				return themes.arctic;
			case 4:
				return themes.mountain;
			default:
				return themes.prairie;
		}
	}

	findCharacterAtIndex(index) {
		return this.positionedCharacters.find((positionedCharacter) => positionedCharacter.position === index);
	}

	isPlayerCharacter(character) {
		return this.playerTypes.some((Type) => character instanceof Type);
	}

	getSelectedCharacter() {
		if (this.selectedIndex === undefined) return undefined;
		return this.findCharacterAtIndex(this.selectedIndex);
	}

	onCellClick(index) {
		if (this.locked) return;
		const positionedCharacter = this.findCharacterAtIndex(index);
		const selected = this.getSelectedCharacter();
		const {
			boardSize
		} = this.gamePlay;

		if (positionedCharacter) {
			if (this.isPlayerCharacter(positionedCharacter.character)) {
				if (this.gameState.currentPlayer !== 'player') {
					return;
				}
				if (this.selectedIndex !== undefined) {
					this.gamePlay.deselectCell(this.selectedIndex);
				}
				this.gamePlay.selectCell(index);
				this.selectedIndex = index;
				return;
			}

			if (selected) {
				const range = ATTACK_RANGE[selected.character.type];
				const from = getRowCol(selected.position, boardSize);
				const to = getRowCol(index, boardSize);
				if (isInAttackRange(from, to, range)) {
					this.attack(selected, positionedCharacter, index);
					return;
				}
			}
			GamePlay.showError('Недопустимое действие');
			return;
		}

		if (selected) {
			const maxDistance = MOVE_RANGE[selected.character.type];
			const from = getRowCol(selected.position, boardSize);
			const to = getRowCol(index, boardSize);
			if (isValidMove(from, to, maxDistance)) {
				this.performMove(selected, index);
				this.gamePlay.deselectCell(this.selectedIndex);
				this.selectedIndex = undefined;
				this.endTurn();

				return;
			}
		}
		GamePlay.showError('Недопустимое действие');
	}

	onCellEnter(index) {
		if (this.locked) return;
		const positionedCharacter = this.findCharacterAtIndex(index);
		const selected = this.getSelectedCharacter();
		const {
			boardSize
		} = this.gamePlay;

		if (positionedCharacter) {
			const {
				character
			} = positionedCharacter;
			const message = characterInfo`🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
			this.gamePlay.showCellTooltip(message, index);

			if (this.isPlayerCharacter(character)) {
				this.gamePlay.setCursor(cursors.pointer);
				return;
			}

			if (selected) {
				const range = ATTACK_RANGE[selected.character.type];
				const from = getRowCol(selected.position, boardSize);
				const to = getRowCol(index, boardSize);
				if (isInAttackRange(from, to, range)) {
					this.gamePlay.selectCell(index, 'red');
					this.gamePlay.setCursor(cursors.crosshair);
					return;
				}
			}
			this.gamePlay.setCursor(cursors.notallowed);
			return;
		}

		if (selected) {
			const maxDistance = MOVE_RANGE[selected.character.type];
			const from = getRowCol(selected.position, boardSize);
			const to = getRowCol(index, boardSize);
			if (isValidMove(from, to, maxDistance)) {
				this.gamePlay.selectCell(index, 'green');
				this.gamePlay.setCursor(cursors.pointer);
				return;
			}
		}
		this.gamePlay.setCursor(cursors.notallowed);
	}

	onCellLeave(index) {
		this.gamePlay.hideCellTooltip(index);
		if (index !== this.selectedIndex) {
			this.gamePlay.deselectCell(index);
		}
	}

	async attack(attacker, target, targetIndex) {
		const damage = Math.max(
			attacker.character.attack - target.character.defence,
			attacker.character.attack * 0.1,
		);
		await this.gamePlay.showDamage(targetIndex, damage);
		target.character.health -= damage;

		if (target.character.health <= 0) {
			this.positionedCharacters = this.positionedCharacters.filter((p) => p !== target);
		}

		if (this.selectedIndex !== undefined) {
			this.gamePlay.deselectCell(this.selectedIndex);
		}
		this.selectedIndex = undefined;
		this.redrawPositions(this.positionedCharacters);

		if (this.checkRoundEnd()) {
			return;
		}

		this.endTurn();
	}

	performMove(positionedCharacter, newIndex) {
		positionedCharacter.position = newIndex;
		this.redrawPositions(this.positionedCharacters);
	}

	endTurn() {
		this.gameState.currentPlayer = this.gameState.currentPlayer === 'player' ? 'enemy' : 'player';
		if (this.gameState.currentPlayer === 'enemy') {
			this.enemyTurn();
		}
	}

	async enemyTurn() {
		const {
			boardSize
		} = this.gamePlay;
		const enemyCharacters = this.positionedCharacters
			.filter((p) => !this.isPlayerCharacter(p.character));
		const playerCharacters = this.positionedCharacters
			.filter((p) => this.isPlayerCharacter(p.character));

		if (enemyCharacters.length === 0 || playerCharacters.length === 0) {
			return;
		}

		let bestAttack = null;
		enemyCharacters.forEach((enemyChar) => {
			const range = ATTACK_RANGE[enemyChar.character.type];
			const from = getRowCol(enemyChar.position, boardSize);

			playerCharacters.forEach((playerChar) => {
				const to = getRowCol(playerChar.position, boardSize);
				if (isInAttackRange(from, to, range)) {
					if (!bestAttack || playerChar.character.health < bestAttack.target.character.health) {
						bestAttack = {
							attacker: enemyChar,
							target: playerChar
						};
					}
				}
			});
		});

		if (bestAttack) {
			const targetIndex = bestAttack.target.position;
			await this.attack(bestAttack.attacker, bestAttack.target, targetIndex);
			return;
		}

		let bestMove = null;

		enemyCharacters.forEach((enemyChar) => {
			const maxDistance = MOVE_RANGE[enemyChar.character.type];
			const from = getRowCol(enemyChar.position, boardSize);

			let nearestPlayer = null;
			let nearestDist = Infinity;
			playerCharacters.forEach((playerChar) => {
				const to = getRowCol(playerChar.position, boardSize);
				const dist = Math.max(Math.abs(to.row - from.row), Math.abs(to.col - from.col));
				if (dist < nearestDist) {
					nearestDist = dist;
					nearestPlayer = playerChar;
				}
			});

			if (!nearestPlayer) return;
			const targetPos = getRowCol(nearestPlayer.position, boardSize);

			for (let idx = 0; idx < boardSize ** 2; idx += 1) {
				if (this.findCharacterAtIndex(idx)) continue;
				const to = getRowCol(idx, boardSize);
				if (!isValidMove(from, to, maxDistance)) continue;

				const distAfter = Math.max(
					Math.abs(targetPos.row - to.row),
					Math.abs(targetPos.col - to.col),
				);

				if (!bestMove || distAfter < bestMove.distAfter) {
					bestMove = {
						character: enemyChar,
						newPosition: idx,
						distAfter
					};
				}
			}
		});

		if (bestMove) {
			this.performMove(bestMove.character, bestMove.newPosition);
		}

		this.endTurn();
	}

	checkRoundEnd() {
		const enemyCharacters = this.positionedCharacters
			.filter((p) => !this.isPlayerCharacter(p.character));
		const playerCharacters = this.positionedCharacters
			.filter((p) => this.isPlayerCharacter(p.character));

		if (enemyCharacters.length === 0) {
			this.levelUpPlayerTeam();
			if (this.level >= 4) {
				this.finishGame(true);
				return true;
			}
			this.startNewLevel();
			return true;
		}

		if (playerCharacters.length === 0) {
			this.finishGame(false);
			return true;
		}

		return false;
	}

	levelUpPlayerTeam() {
		this.playerTeam.characters.forEach((character) => {
			character.levelUp();
		});
	}

	startNewLevel() {
		this.level += 1;
		this.gamePlay.drawUi(this.getThemeByLevel(this.level));

		const enemyTypes = [Vampire, Undead, Daemon];
		this.enemyTeam = generateTeam(enemyTypes, this.level, this.playerTeam.characters.length);

		const playerPositions = this.generatePositions([0, 1], this.playerTeam.characters.length);
		const enemyPositions = this.generatePositions([6, 7], this.enemyTeam.characters.length);

		const positionedCharacters = [
			...this.playerTeam.characters.map((character, index) => new PositionedCharacter(character, playerPositions[index])),
			...this.enemyTeam.characters.map((character, index) => new PositionedCharacter(character, enemyPositions[index])),
		];

		this.redrawPositions(positionedCharacters);
		this.gameState.currentPlayer = 'player';
	}

	finishGame(won) {
		this.locked = true;
		const score = this.playerTeam.characters.reduce((sum, c) => sum + c.level, 0);
		this.gameState.maxScore = Math.max(this.gameState.maxScore, score);
		this.saveState();
		GamePlay.showMessage(
			won ? `Поздравляем, вы прошли игру! Счёт: ${score}` : `Поражение. Ваш счёт: ${score}`,
		);
	}

	startNewGame() {
		const maxScore = this.gameState ? this.gameState.maxScore : 0;
		this.level = 1;
		this.locked = false;
		this.selectedIndex = undefined;
		this.gameState = new GameState();
		this.gameState.maxScore = maxScore;
		this.startGame();
	}

	serializePositions() {
		return this.positionedCharacters.map((p) => ({
			type: p.character.type,
			level: p.character.level,
			attack: p.character.attack,
			defence: p.character.defence,
			health: p.character.health,
			position: p.position,
		}));
	}

	deserializePositions(positions) {
		return positions.map((p) => {
			const CharClass = CHARACTER_CLASSES[p.type];
			const character = new CharClass(1);
			character.level = p.level;
			character.attack = p.attack;
			character.defence = p.defence;
			character.health = p.health;
			return new PositionedCharacter(character, p.position);
		});
	}

	saveState() {
		const state = GameState.from({
			level: this.level,
			currentPlayer: this.gameState.currentPlayer,
			maxScore: this.gameState.maxScore,
			locked: this.locked,
			positions: this.positionedCharacters ? this.serializePositions() : [],
		});
		this.stateService.save(state);
	}

	loadGame(showErrorOnFail) {
		try {
			const saved = this.stateService.load();

			if (!saved || !saved.positions || saved.positions.length == 0) {
				return false;
			}

			this.gameState = GameState.from(saved);
			this.level = this.gameState.level;
			this.locked = this.gameState.locked;
			this.playerTypes = [Bowman, Swordsman, Magician];

			const positionedCharacters = this.deserializePositions(this.gameState.positions);
			this.playerTeam = {
				characters: positionedCharacters
					.filter((p) => this.isPlayerCharacter(p.character))
					.map((p) => p.character),
			};
			this.enemyTeam = {
				characters: positionedCharacters
					.filter((p) => !this.isPlayerCharacter(p.character))
					.map((p) => p.character),
			};

			this.gamePlay.drawUi(this.getThemeByLevel(this.level));
			this.redrawPositions(positionedCharacters);
			return true;
		} catch (e) {
			if (showErrorOnFail) {
				GamePlay.showError('Не удалось загрузить сохранённую игру');
			}
			return false;
		}
	}
}