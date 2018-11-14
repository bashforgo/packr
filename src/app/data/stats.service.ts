import { Injectable } from '@angular/core';
import { CardsService, CollectionService } from './';
import { Rarity, ShortRarity, CostDictionary, CardClass, Dust, ShortRarityDictionary, CardClassDictionary } from './types';
import { ReplaySubject, Observable } from 'rxjs';
import { withLatestFrom, map, tap, multicast, refCount } from 'rxjs/operators';

import Dictionary = _.Dictionary;
type StatsDictionary = { target?: number, norm: number, normExtra?: number, gold: number, goldExtra?: number, any?: number };

@Injectable()
export class StatsService {
  public events;
  private completion: {
    byRarity: Observable<ShortRarityDictionary<StatsDictionary> & { total: StatsDictionary }>,
    byClass: Observable<CardClassDictionary<StatsDictionary>>
  };
  private card: Observable<ShortRarityDictionary<StatsDictionary>>;
  private dust: Observable<ShortRarityDictionary<StatsDictionary>>;
  private _card: Observable<ShortRarityDictionary<StatsDictionary>>;

  constructor(cards: CardsService, cs: CollectionService) {
    this.completion = {
      byRarity: cs.rarity
        .pipe(
          withLatestFrom(cards.currentSet),
          map(([collection, cards]) => {
            return _.mapValues(collection, (countsByName, rarity: ShortRarity) => {
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
          }),
          tap((rarities: Dictionary<StatsDictionary>) => rarities.total = _.reduce(
            rarities,
            (res, obj) => _.assignWith(res, obj, (a: number, b: number) => (a || 0) + (b || 0)),
            {} as StatsDictionary
          )),
          multicast(() => new ReplaySubject<ShortRarityDictionary<StatsDictionary> & { total: StatsDictionary }>(1)),
          refCount()
        ),
      byClass: cs.klass
        .pipe(
          withLatestFrom(cards.currentSet),
          map(([collection, cards]) => {
            return _.mapValues(collection, (countsByName, klass: CardClass) => {
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
          }),
          multicast(() => new ReplaySubject<CardClassDictionary<StatsDictionary>>(1)),
          refCount()
        )
    };

    this._card = cs.rarity
      .pipe(
        map(rarities => {
          return _.mapValues<ShortRarityDictionary<Dictionary<CostDictionary<number>>>, StatsDictionary>(rarities, (countsByName, rarity: ShortRarity) => {
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
        }),
        multicast(() => new ReplaySubject<ShortRarityDictionary<StatsDictionary>>(1)),
        refCount()
      );

    this.card = this._card
      .pipe(
        map((rarities) => _.assign({
          total: _.reduce(
            rarities,
            (res, obj) => _.assignWith(res, obj, (a: number, b: number) => (a || 0) + (b || 0)),
            {}
          )
        }, rarities)),
        multicast(() => new ReplaySubject<ShortRarityDictionary<StatsDictionary>>(1)),
        refCount()
      );

    this.dust = this._card
      .pipe(
        map(rarities => _.mapValues(rarities, ({ norm, normExtra, gold, goldExtra }, rarity: ShortRarity) => {
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
        }) as unknown as ShortRarityDictionary<StatsDictionary>),
        map((rarities) => _.assign({
          total: _.reduce(
            rarities,
            (res, obj) => _.assignWith(res, obj, (a: number, b: number) => (a || 0) + (b || 0)),
            {}
          )
        }, rarities)),
        multicast(() => new ReplaySubject<ShortRarityDictionary<StatsDictionary>>(1)),
        refCount()
      );
  }
}
