export type PlayerClass = 'DRUID' | 'HUNTER' | 'MAGE' | 'PALADIN' | 'PRIEST' | 'ROGUE' | 'SHAMAN' | 'WARLOCK' | 'WARRIOR';

export namespace PlayerClass {
  export const DRUID : PlayerClass = 'DRUID';
  export const HUNTER : PlayerClass = 'HUNTER';
  export const MAGE : PlayerClass = 'MAGE';
  export const PALADIN : PlayerClass = 'PALADIN';
  export const PRIEST : PlayerClass = 'PRIEST';
  export const ROGUE : PlayerClass = 'ROGUE';
  export const SHAMAN : PlayerClass = 'SHAMAN';
  export const WARLOCK : PlayerClass = 'WARLOCK';
  export const WARRIOR : PlayerClass = 'WARRIOR';
}

export type PlayerMultiClass = 'GOONS' | 'KABAL' | 'LOTUS';

export namespace PlayerMultiClass {
  export const GOONS : PlayerMultiClass = 'GOONS';
  export const KABAL : PlayerMultiClass = 'KABAL';
  export const LOTUS : PlayerMultiClass = 'LOTUS';

  const _classes = {
    [GOONS]: [PlayerClass.HUNTER, PlayerClass.PALADIN, PlayerClass.WARRIOR],
    [KABAL]: [PlayerClass.MAGE, PlayerClass.PRIEST, PlayerClass.WARLOCK],
    [LOTUS]: [PlayerClass.DRUID, PlayerClass.ROGUE, PlayerClass.SHAMAN]
  };
  const _classesBack = {
    [PlayerClass.HUNTER]: GOONS,
    [PlayerClass.PALADIN]: GOONS,
    [PlayerClass.WARRIOR]: GOONS,
    [PlayerClass.MAGE]: KABAL,
    [PlayerClass.PRIEST]: KABAL,
    [PlayerClass.WARLOCK]: KABAL,
    [PlayerClass.DRUID]: LOTUS,
    [PlayerClass.ROGUE]: LOTUS,
    [PlayerClass.SHAMAN]: LOTUS
  };

  export const classes = (c : PlayerMultiClass) => _classes[c];
  export const classesBack = (c : PlayerClass) => _classesBack[c];
}

export type CardClass = PlayerClass | PlayerMultiClass | 'NEUTRAL';
export type CardClassDictionary<T> = {
  HUNTER? : T,
  PALADIN? : T,
  WARRIOR? : T,
  MAGE? : T,
  PRIEST? : T,
  WARLOCK? : T,
  DRUID? : T,
  ROGUE? : T,
  SHAMAN? : T,
  GOONS? : T,
  KABAL? : T,
  LOTUS? : T,
  NEUTRAL? : T,
}
