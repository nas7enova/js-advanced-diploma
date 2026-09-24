/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
	constructor(level, type = 'generic') {
		if (new.target === Character) {
			throw new Error('Нельзя создать элемент базаового класса напрямую');
		}

		this.level = 1;
		this.attack = 0;
		this.defence = 0;
		this.health = 50;
		this.type = type;
	}

	levelUp() {
		if (this.health <= 0) {
			throw new Error('Нельзя повысить уровень погибшего персонажа');
		}

		const life = this.health;
		this.level += 1;
		this.attack = Math.max(this.attack, this.attack * (80 + life) / 100);
		this.defence = Math.max(this.defence, this.defence * (80 + life) / 100);
		this.health = Math.min(life + 80, 100);
	}

	applyLevelUps(targetLevel) {
		while (this.level < targetLevel) {
			this.levelUp();
		}
	}
}