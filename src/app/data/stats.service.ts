import { Injectable } from '@angular/core';
import { CardsService, CollectionService } from './';
import { Rarity, DisplayCard } from './types';

type Card = DisplayCard;

@Injectable()
export class StatsService {
  public events;

  constructor(cs : CardsService, cls : CollectionService) {
    this.events = cls.events
      .withLatestFrom(cs.currentSet)
      .map(([collection, cards]) => {
        const result = { target: cards.target };

        _(collection)
          .map(costDict => {
            const { gold, norm } = costDict;
            const any = _.assignWith({}, gold, norm, (a : number, b : number) => (a || 0) + (b || 0));

            return _({ gold, norm, any })
              .map((countByName, cost) => _(countByName)
                .map((count, name) => {
                  const rarity = Rarity.short(cards.all[name].rarity);
                  const max = Rarity.max(rarity);

                  addToResult(['total', cost, rarity], count);
                  addToResult(['uniq', cost, rarity], _.clamp(count, 0, max));

                  if (Rarity.isExtra(rarity, count)) {
                    const extraCount = count - max;

                    addToResult(['extra', cost, rarity], extraCount);
                  }
                })
                .value())
              .value();
          })
          .value();

        return result;

        function addToResult(path : string[], amount : number) {
          const [field, cost, rarity] = path;
          if (cost === 'any' && field !== 'uniq') { return null; }
          const count = _.get<number>(result, path) || 0;
          _.set(result, path, count + amount);

          if (cost !== 'total' && cost !== 'any') {
            addToResult([field, 'total', rarity], amount);
          }
        }
      });
  }
}
