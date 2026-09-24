/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
	const row = Math.floor(index / boardSize);
	const col = index % boardSize;

	const isTop = row === 0;
	const isBottom = row === boardSize - 1;
	const isLeft = col === 0;
	const isRight = col === boardSize - 1;

	if (isTop && isLeft) return 'top-left';
	if (isTop && isRight) return 'top-right';
	if (isBottom && isLeft) return 'bottom-left';
	if (isBottom && isRight) return 'bottom-right';
	if (isTop) return 'top';
	if (isBottom) return 'bottom';
	if (isLeft) return 'left';
	if (isRight) return 'right';
	// TODO: ваш код будет тут
	return 'center';
}

export function calcHealthLevel(health) {
	if (health < 15) {
		return 'critical';
	}

	if (health < 50) {
		return 'normal';
	}

	return 'high';
}

export function characterInfo(strings, level, attack, defence, health) {
	return `${strings[0]}${level}${strings[1]}${attack}${strings[2]}${defence}${strings[3]}${health}`;
}

export const MOVE_RANGE = {
	swordsman: 4,
	undead: 4,
	bowman: 2,
	vampire: 2,
	magician: 1,
	daemon: 1,
};

export const ATTACK_RANGE = {
	swordsman: 1,
	undead: 1,
	bowman: 2,
	vampire: 2,
	magician: 4,
	daemon: 4,
};

export function getRowCol(index, boardSize) {
	return {
		row: Math.floor(index / boardSize),
		col: index % boardSize
	};
}

export function isValidMove(from, to, maxDistance) {
	const dRow = to.row - from.row;
	const dCol = to.col - from.col;
	if (dRow === 0 && dCol === 0) return false;

	const isStraight = dRow === 0 || dCol === 0;
	const isDiagonal = Math.abs(dRow) === Math.abs(dCol);
	if (!isStraight && !isDiagonal) return false;

	return Math.max(Math.abs(dRow), Math.abs(dCol)) <= maxDistance;
}

export function isInAttackRange(from, to, range) {
	const distance = Math.max(Math.abs(to.row - from.row), Math.abs(to.col - from.col));
	return distance > 0 && distance <= range;
}