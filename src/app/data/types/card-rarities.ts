export type Rarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

class RarityFactory {
  COMMON : Rarity;
  RARE : Rarity;
  EPIC : Rarity;
  LEGENDARY : Rarity;

  private _short = {
    [this.COMMON]: 'comn',
    [this.RARE]: 'rare',
    [this.EPIC]: 'epic',
    [this.LEGENDARY]: 'lgnd'
  };

  short(r : Rarity) {
    return this._short[r];
  }
}

export const Rarities = new RarityFactory();
