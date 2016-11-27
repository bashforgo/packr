import { Injectable } from '@angular/core';
import { CardsService, CollectionService } from './';
import { Rarity, ShortRarity, CostDictionary, CardClass } from './types';
import { ReplaySubject } from 'rxjs';
import Dictionary = _.Dictionary;
import any = jasmine.any;

@Injectable()
export class StatsService {
  public events;
  private completion;

  constructor(cards : CardsService, cs : CollectionService) {
    this.completion = {};

    this.completion.byRarity = cs.rarity
      .withLatestFrom(cards.currentSet)
      .map(([collection, cards]) => {
        return _.mapValues(collection, (countsByName, rarity : ShortRarity) => {
          const target = cards.target.byRarity[rarity];

          const [norm, gold, any] = _.reduce(
            countsByName as Dictionary<CostDictionary<number>>,
            ([norm, gold, any], counts) => {
              const [nNorm, nGold, nAny] = _.map(
                [(counts.norm || 0), (counts.gold || 0), (counts.norm || 0) + (counts.gold || 0)],
                v => _.clamp(v, 0, Rarity.max(rarity))
              );
              return [norm + nNorm, gold + nGold, any + nAny];
            },
            [0, 0, 0]
          );

          return { target, norm, gold, any };
        });
      })
      .do((rarities) => rarities.total = _.reduce(
        rarities,
        (res, obj) => _.assignWith(res, obj, (a : number, b : number) => (a || 0) + (b || 0)),
        {}
      ))
      .multicast(() => new ReplaySubject<any>(1))
      .refCount();

    this.completion.byClass = cs.events
      .withLatestFrom(cards.currentSet)
      .map(([collection, cards]) => {
        return _.mapValues(collection, (countsByName, klass : CardClass) => {
          const target = cards.target.byClass[klass];

          const [norm, gold, any] = _.reduce(
            countsByName as Dictionary<CostDictionary<number>>,
            ([norm, gold, any], counts, name) => {
              const [nNorm, nGold, nAny] = _.map(
                [(counts.norm || 0), (counts.gold || 0), (counts.norm || 0) + (counts.gold || 0)],
                v => _.clamp(v, 0, Rarity.max(Rarity.short(cards.all[name].rarity)))
              );
              return [norm + nNorm, gold + nGold, any + nAny];
            },
            [0, 0, 0]
          );

          return { target, norm, gold, any };
        });
      })
      .multicast(() => new ReplaySubject<any>(1))
      .refCount();
  }
}
