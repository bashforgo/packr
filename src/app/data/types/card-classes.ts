export type PlayerClass = 'DRUID' | 'HUNTER' | 'MAGE' | 'PALADIN' | 'PRIEST' | 'ROGUE' | 'SHAMAN' | 'WARLOCK' | 'WARRIOR';

class PlayerClassesFactory {
  DRUID : PlayerClass = 'DRUID';
  HUNTER : PlayerClass = 'HUNTER';
  MAGE : PlayerClass = 'MAGE';
  PALADIN : PlayerClass = 'PALADIN';
  PRIEST : PlayerClass = 'PRIEST';
  ROGUE : PlayerClass = 'ROGUE';
  SHAMAN : PlayerClass = 'SHAMAN';
  WARLOCK : PlayerClass = 'WARLOCK';
  WARRIOR : PlayerClass = 'WARRIOR';
}

export const PlayerClasses = new PlayerClassesFactory();

export type PlayerMultiClass = 'GOONS' | 'KABAL' | 'LOTUS';

class PlayerMultiClassFactory {
  GOONS : PlayerMultiClass = 'GOONS';
  KABAL : PlayerMultiClass = 'KABAL';
  LOTUS : PlayerMultiClass = 'LOTUS';

  private _classes = {
    [this.GOONS]: [PlayerClasses.HUNTER, PlayerClasses.PALADIN, PlayerClasses.WARRIOR],
    [this.KABAL]: [PlayerClasses.MAGE, PlayerClasses.PRIEST, PlayerClasses.WARLOCK],
    [this.LOTUS]: [PlayerClasses.DRUID, PlayerClasses.ROGUE, PlayerClasses.SHAMAN]
  };
  private _classesBack= {
    [PlayerClasses.HUNTER]: this.GOONS,
    [PlayerClasses.PALADIN]: this.GOONS,
    [PlayerClasses.WARRIOR]: this.GOONS,
    [PlayerClasses.MAGE]: this.KABAL,
    [PlayerClasses.PRIEST]: this.KABAL,
    [PlayerClasses.WARLOCK]: this.KABAL,
    [PlayerClasses.DRUID]: this.LOTUS,
    [PlayerClasses.ROGUE]: this.LOTUS,
    [PlayerClasses.SHAMAN]: this.LOTUS
  };

  classes(c : PlayerMultiClass) {
    return this._classes[c];
  }

  classesBack(c : PlayerClass) {
    return this._classesBack[c];
  }
}

export const PlayerMultiClasses = new PlayerMultiClassFactory();

export type CardClass = PlayerClass | PlayerMultiClass;
