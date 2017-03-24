export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type ShortRarity = 'comn' | 'rare' | 'epic' | 'lgnd';
export type ShortRarityDictionary<T> = {
  comn : T;
  rare : T;
  epic : T;
  lgnd : T
};

export namespace Rarity {
  export const COMMON : Rarity = 'COMMON';
  export const RARE : Rarity = 'RARE';
  export const EPIC : Rarity = 'EPIC';
  export const LEGENDARY : Rarity = 'LEGENDARY';

  const _short = {
    [COMMON]: <ShortRarity>'comn',
    [RARE]: <ShortRarity>'rare',
    [EPIC]: <ShortRarity>'epic',
    [LEGENDARY]: <ShortRarity>'lgnd'
  };
  const _shortBack = {
    comn: COMMON,
    rare: RARE,
    epic: EPIC,
    lgnd: LEGENDARY
  };
  const _maxAmount = {
    comn: 2,
    rare: 2,
    epic: 2,
    lgnd: 1
  };

  export const short = (r : Rarity) => _short[r];
  export const shortBack = (r : ShortRarity) => _shortBack[r];
  export const list = () => _.keys(_short);
  export const shortList = () => _.keys(_shortBack);
  export const max = (r : ShortRarity) => _maxAmount[r];
  export const isExtra = (r : ShortRarity, count : number) => Rarity.max(r) < count;
}

export type Cost = 'gold' | 'norm';

export namespace Cost {
  export const other = (c : Cost) => c === 'gold' ? 'norm' : 'gold';
}

export type CostDictionary<T> = {
  gold? : T,
  norm? : T
};
