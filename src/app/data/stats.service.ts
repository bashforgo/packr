import { Injectable } from '@angular/core';
import { CardsService, CollectionService } from './';
import { Rarity, ShortRarity, CostDictionary, CardClass, Dust } from './types';
import { ReplaySubject } from 'rxjs';
import Dictionary = _.Dictionary;

@Injectable()
export class StatsService {
  public events;
  private completion;
  private card;
  private dust;
  private _card;

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

    this._card = cs.rarity
      .map(rarities => {
        return _.mapValues(rarities, (countsByName, rarity : ShortRarity) => {
          const [total, norm, normExtra, gold, goldExtra] = _.reduce(
            countsByName as Dictionary<CostDictionary<number>>,
            ([total, tNorm, normExtra, tGold, goldExtra], counts) => {
              const norm = counts.norm || 0;
              const gold = counts.gold || 0;
              return [
                total + norm + gold,
                tNorm + norm,
                normExtra + _.clamp(norm - Rarity.max(rarity), 0, Infinity),
                tGold + gold,
                goldExtra + _.clamp(gold - Rarity.max(rarity), 0, Infinity)
              ];
            },
            [0, 0, 0, 0, 0]
          );

          return { total, norm, normExtra, gold, goldExtra };
        });
      })
      .multicast(() => new ReplaySubject<any>(1))
      .refCount();

    this.card = this._card
      .map((rarities) => _.assign({
        total: _.reduce(
          rarities,
          (res, obj) => _.assignWith(res, obj, (a : number, b : number) => (a || 0) + (b || 0)),
          {}
        )
      }, rarities))
      .multicast(() => new ReplaySubject<any>(1))
      .refCount();

    this.dust = this._card
      .map(rarities => _.mapValues(rarities, ({ norm, normExtra, gold, goldExtra }, rarity : ShortRarity) => {
        const dNorm = norm * Dust.value({ cost: 'norm', rarity });
        const dGold = gold * Dust.value({ cost: 'gold', rarity });
        const dNormExtra = normExtra * Dust.value({ cost: 'norm', rarity });
        const dGoldExtra = goldExtra * Dust.value({ cost: 'gold', rarity });
        return {
          norm: dNorm,
          normExtra: dNormExtra,
          gold: dGold,
          goldExtra: dGoldExtra,
          total: dNorm + dGold,
          totalExtra: dNormExtra + dGoldExtra
        };
      }))
      .map((rarities) => _.assign({
        total: _.reduce(
          rarities,
          (res, obj) => _.assignWith(res, obj, (a : number, b : number) => (a || 0) + (b || 0)),
          {}
        )
      }, rarities))
      .multicast(() => new ReplaySubject<any>(1))
      .refCount();
  }
}
