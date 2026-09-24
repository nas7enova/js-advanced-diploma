export default class GameState {
	constructor() {
		this.level = 1;
		this.currentPlayer = 'player';
		this.maxScore = 0;
		this.locked = false;
		this.position = [];
	}

	static from(object) {
		const state = new GameState();
		if (object) {
			Object.assign(state, object);
		}
		return state;
	}
}