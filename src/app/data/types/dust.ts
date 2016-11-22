import { Pack, DisplayCard } from './';
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
  const _craft = {
    norm: {
      comn: 40,
      rare: 100,
      epic: 400,
      lgnd: 1600,
    },
    gold: {
      comn: 400,
      rare: 800,
      epic: 1600,
      lgnd: 3200,
    }
  };

  export const value = (packOrCard : Pack | DisplayCard) : number => {
    if ((<Pack>packOrCard).length === 5) {
      const pack = packOrCard as Pack;

      return _(pack)
        .reduce((acc, card) => acc + value(card), 0);
    } else {
      const card = packOrCard as DisplayCard;
      return _disenchant[card.cost][card.rarity];
    }
  };
}
