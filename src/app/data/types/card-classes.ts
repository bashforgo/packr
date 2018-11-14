export type PlayerClass = 'DRUID' | 'HUNTER' | 'MAGE' | 'PALADIN' | 'PRIEST' | 'ROGUE' | 'SHAMAN' | 'WARLOCK' | 'WARRIOR';

export namespace PlayerClass {
  export const DRUID: PlayerClass = 'DRUID';
  export const HUNTER: PlayerClass = 'HUNTER';
  export const MAGE: PlayerClass = 'MAGE';
  export const PALADIN: PlayerClass = 'PALADIN';
  export const PRIEST: PlayerClass = 'PRIEST';
  export const ROGUE: PlayerClass = 'ROGUE';
  export const SHAMAN: PlayerClass = 'SHAMAN';
  export const WARLOCK: PlayerClass = 'WARLOCK';
  export const WARRIOR: PlayerClass = 'WARRIOR';
}

export type PlayerMultiClass = 'GRIMY_GOONS' | 'KABAL' | 'JADE_LOTUS';

export namespace PlayerMultiClass {
  const { DRUID, HUNTER, MAGE, PALADIN, PRIEST, ROGUE, SHAMAN, WARLOCK, WARRIOR } = PlayerClass;

  export const GOONS: PlayerMultiClass = 'GRIMY_GOONS';
  export const KABAL: PlayerMultiClass = 'KABAL';
  export const LOTUS: PlayerMultiClass = 'JADE_LOTUS';

  const _classes = {
    [GOONS]: [HUNTER, PALADIN, WARRIOR],
    [KABAL]: [MAGE, PRIEST, WARLOCK],
    [LOTUS]: [DRUID, ROGUE, SHAMAN]
  };
  const _classesBack = {
    [HUNTER]: GOONS,
    [PALADIN]: GOONS,
    [WARRIOR]: GOONS,
    [MAGE]: KABAL,
    [PRIEST]: KABAL,
    [WARLOCK]: KABAL,
    [DRUID]: LOTUS,
    [ROGUE]: LOTUS,
    [SHAMAN]: LOTUS
  };

  export const classes = (c: PlayerMultiClass) => _classes[c];
  export const classesBack = (c: PlayerClass) => _classesBack[c];
}

export type CardClass = PlayerClass | PlayerMultiClass | 'NEUTRAL';

export namespace CardClass {
  const { DRUID, HUNTER, MAGE, PALADIN, PRIEST, ROGUE, SHAMAN, WARLOCK, WARRIOR } = PlayerClass;
  const { GOONS, KABAL, LOTUS } = PlayerMultiClass;

  export const classList = (forMSG: boolean): CardClass[] => forMSG
    ? [HUNTER, PALADIN, WARRIOR, GOONS, MAGE, PRIEST, WARLOCK, KABAL, DRUID, ROGUE, SHAMAN, LOTUS, 'NEUTRAL']
    : [HUNTER, PALADIN, WARRIOR, MAGE, PRIEST, WARLOCK, DRUID, ROGUE, SHAMAN, 'NEUTRAL'];
}

export type CardClassDictionary<T> = {
  HUNTER?: T,
  PALADIN?: T,
  WARRIOR?: T,
  MAGE?: T,
  PRIEST?: T,
  WARLOCK?: T,
  DRUID?: T,
  ROGUE?: T,
  SHAMAN?: T,
  GOONS?: T,
  KABAL?: T,
  LOTUS?: T,
  NEUTRAL?: T
};
