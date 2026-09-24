import Character from '../js/Character';
import Bowman from '../js/characters/Bowman';
import Swordsman from '../js/characters/Swordsman';
import Magician from '../js/characters/Magician';
import Vampire from '../js/characters/Vampire';
import Undead from '../js/characters/Undead';
import Daemon from '../js/characters/Daemon';
import { characterInfo } from '../js/utils';
import { characterGenerator, generateTeam } from '../js/generators';

describe('Character', () => {
  test('выбрасывает исключение при создании объекта Character напрямую', () => {
    expect(() => new Character(1)).toThrow();
  });

  test('не выбрасывает исключение при создании наследников Character', () => {
    expect(() => new Bowman(1)).not.toThrow();
    expect(() => new Swordsman(1)).not.toThrow();
    expect(() => new Magician(1)).not.toThrow();
    expect(() => new Vampire(1)).not.toThrow();
    expect(() => new Undead(1)).not.toThrow();
    expect(() => new Daemon(1)).not.toThrow();
  });
});

describe('Характеристики персонажей 1-го уровня', () => {
  test('Bowman 1 уровня имеет правильные характеристики', () => {
    const bowman = new Bowman(1);
    expect(bowman.attack).toBe(25);
    expect(bowman.defence).toBe(25);
    expect(bowman.health).toBe(50);
    expect(bowman.level).toBe(1);
    expect(bowman.type).toBe('bowman');
  });

  test('Swordsman 1 уровня имеет правильные характеристики', () => {
    const swordsman = new Swordsman(1);
    expect(swordsman.attack).toBe(40);
    expect(swordsman.defence).toBe(10);
    expect(swordsman.health).toBe(50);
    expect(swordsman.level).toBe(1);
    expect(swordsman.type).toBe('swordsman');
  });

  test('Magician 1 уровня имеет правильные характеристики', () => {
    const magician = new Magician(1);
    expect(magician.attack).toBe(10);
    expect(magician.defence).toBe(40);
    expect(magician.health).toBe(50);
    expect(magician.level).toBe(1);
    expect(magician.type).toBe('magician');
  });

  test('Vampire 1 уровня имеет правильные характеристики', () => {
    const vampire = new Vampire(1);
    expect(vampire.attack).toBe(25);
    expect(vampire.defence).toBe(25);
    expect(vampire.health).toBe(50);
    expect(vampire.level).toBe(1);
    expect(vampire.type).toBe('vampire');
  });

  test('Undead 1 уровня имеет правильные характеристики', () => {
    const undead = new Undead(1);
    expect(undead.attack).toBe(40);
    expect(undead.defence).toBe(10);
    expect(undead.health).toBe(50);
    expect(undead.level).toBe(1);
    expect(undead.type).toBe('undead');
  });

  test('Daemon 1 уровня имеет правильные характеристики', () => {
    const daemon = new Daemon(1);
    expect(daemon.attack).toBe(10);
    expect(daemon.defence).toBe(10);
    expect(daemon.health).toBe(50);
    expect(daemon.level).toBe(1);
    expect(daemon.type).toBe('daemon');
  });
});

describe('characterGenerator', () => {
  test('бесконечно генерирует персонажей из allowedTypes', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const generator = characterGenerator(allowedTypes, 1);

    for (let i = 0; i < 50; i += 1) {
      const { value, done } = generator.next();
      expect(done).toBe(false);
      expect(allowedTypes.some((TypeClass) => value instanceof TypeClass)).toBe(true);
    };
  });

  test('учитывает только классы из allowedTypes', () => {
    const allowedTypes = [Bowman];
    const generator = characterGenerator(allowedTypes, 1);

    for (let i = 0; i < 20; i += 1) {
      const { value } = generator.next();
      expect(value).toBeInstanceOf(Bowman);
    }
  });
});

describe('generateTeam', () => {
  test('создаёт нужное количество персонажей', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const team = generateTeam(allowedTypes, 3, 4);

    expect(team.characters).toHaveLength(4);
  });

  test('уровни персонажей находятся в диапазоне [1, maxLevel]', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 3;
    const team = generateTeam(allowedTypes, maxLevel, 10);

    team.characters.forEach((character) => {
      expect(character.level).toBeGreaterThanOrEqual(1);
      expect(character.level).toBeLessThanOrEqual(maxLevel);
    });
  });

  test('персонажи созданы только из allowedTypes', () => {
    const allowedTypes = [Bowman, Swordsman];
    const team = generateTeam(allowedTypes, 2, 10);

    team.characters.forEach((character) => {
      expect(allowedTypes.some((TypeClass) => character instanceof TypeClass)).toBe(true);
    });
  });
});

describe('characterInfo', () => {
  test('форматирует характеристики персонажа в нужном формате', () => {
    const result = characterInfo`🎖${1} ⚔${10} 🛡${40} ❤${50}`;
    expect(result).toBe('🎖1 ⚔10 🛡40 ❤50');
  });

  test('корректно работает с разными значениями', () => {
    const result = characterInfo`🎖${3} ⚔${25} 🛡${25} ❤${50}`;
    expect(result).toBe('🎖3 ⚔25 🛡25 ❤50');
  });

  test('работает с нулевыми значениями характеристик', () => {
    const result = characterInfo`🎖${1} ⚔${0} 🛡${0} ❤${50}`;
    expect(result).toBe('🎖1 ⚔0 🛡0 ❤50');
  });

  test('формирует статистику правильно', () => {
  const level = 1, attack = 10, defence = 40, health = 50;
  const result = characterInfo`🎖${level} ⚔${attack} 🛡${defence} ❤${health}`;
  expect(result).toBe('🎖1 ⚔10 🛡40 ❤50');
  });
});