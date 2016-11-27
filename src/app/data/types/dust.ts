import { Pack, ShortRarity, Cost } from './';
export namespace Dust {
  const _disenchant = {
    norm: {
      comn: 5,
      rare: 20,
      epic: 100,
      lgnd: 400,
    },
    gold: {
      comn: 50,
      rare: 100,
      epic: 400,
      lgnd: 1600,
    }
  };

  export const value = (packOrCard : Pack | { cost: Cost, rarity: ShortRarity }) : number => {
    if ((<Pack>packOrCard).length === 5) {
      const pack = packOrCard as Pack;

      return _(pack)
        .reduce((acc, card) => acc + value(card), 0);
    } else {
      const card = packOrCard as { cost: Cost, rarity: ShortRarity };
      return _disenchant[card.cost][card.rarity];
    }
  };
}
