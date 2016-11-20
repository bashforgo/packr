import { Injectable } from '@angular/core';
import { CardsService, CollectionService } from './';
import { Rarity } from './types';

@Injectable()
export class StatsService {
  public events;

  constructor(cs : CardsService, cls : CollectionService) {
    this.events = cls.events
      .withLatestFrom(cs.currentSet)
      .map(([collection, cards]) => {
        const result = {};
        _(collection)
          .map(pClassDict => _(pClassDict)
            .map((card, cost) => _(card)
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
            .value())
          .value();

        return result;

        function addToResult(path: string[], amount : number) {
          const count = _.get<number>(result, path) || 0;
          _.set(result, path, count + amount);

          const [field, cost, rarity] = path;
          if (cost !== 'total') {
            addToResult([field, 'total', rarity], amount);
          }
        }
      });
  }
}
