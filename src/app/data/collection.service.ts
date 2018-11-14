import { Injectable } from '@angular/core';
import { Dictionary, get, map, memoize, set, transform } from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';
import { map as rxMap, multicast, refCount, withLatestFrom } from 'rxjs/operators';
import { PacksGeneratorService, PacksOpenerService } from './';
import { CardClass, CardClassDictionary, CardSet, CostDictionary, DisplayCard, Pack, Packs, Rarity, ShortRarityDictionary } from './types';

type Card = Required<DisplayCard>;
type CollectionPack = [Card, Card, Card, Card, Card];
export type Collection = Dictionary<CostDictionary<number>>;
type CollectionIOSignature = [
  Collection,
  CardClassDictionary<Dictionary<CostDictionary<number>>>,
  ShortRarityDictionary<Dictionary<CostDictionary<number>>>,
  CollectionPack[]
];
type CollectionResetSignature = [
  Collection,
  CardClassDictionary<Dictionary<CostDictionary<number>>>,
  ShortRarityDictionary<Dictionary<CostDictionary<number>>>,
  ((pks: Packs) => CollectionIOSignature)
];

@Injectable()
export class CollectionService {
  public events: Observable<Collection>;
  public klass: Observable<CardClassDictionary<Dictionary<CostDictionary<number>>>>;
  public rarity: Observable<ShortRarityDictionary<Dictionary<CostDictionary<number>>>>;
  public packs: Observable<CollectionPack[]>;
  private _events: Observable<CollectionIOSignature>;

  constructor(pgs: PacksGeneratorService, pos: PacksOpenerService) {
    this._events = pgs.events
      .pipe(
        withLatestFrom(
          pos.events
            .pipe(rxMap(({ type }): CollectionResetSignature => {
              const collection: { [cardName: string]: CostDictionary<number> } = {};
              const klassBreakdown = transform(
                CardClass.classList(CardSet.isMSG(type)),
                (res, name) => res[name] = {},
                {}
              ) as CardClassDictionary<Dictionary<CostDictionary<number>>>;
              const rarityBreakdown = transform(
                Rarity.shortList(),
                (res, name) => res[name] = {},
                {}
              ) as ShortRarityDictionary<Dictionary<CostDictionary<number>>>;
              const _packsProcessor = memoize((pack: Pack) => {
                return map(
                  pack,
                  (card: Card) => {
                    const { cardClass, cost, detail, name, rarity } = card;
                    const path = [name, cost];
                    const count = get(collection, path, 0) + 1;
                    set(collection, path, count);

                    path.unshift(cardClass);
                    set(klassBreakdown, path, count);

                    path[0] = rarity;
                    set(rarityBreakdown, path, count);

                    return {
                      extra: Rarity.isExtra(rarity, count),
                      cardClass, cost, detail, name, rarity
                    };
                  }
                ) as CollectionPack;
              });

              const packsProcessor: (pks: Pack[]) => [
                Dictionary<CostDictionary<number>>,
                CardClassDictionary<Dictionary<CostDictionary<number>>>,
                ShortRarityDictionary<Dictionary<CostDictionary<number>>>,
                CollectionPack[]
              ] = (pks) => [collection, klassBreakdown, rarityBreakdown, map(pks, _packsProcessor)];

              if (CardSet.isWOG(type)) {
                _packsProcessor([
                  {
                    cardClass: 'NEUTRAL', cost: 'norm', name: `C'Thun`, rarity: 'lgnd', detail: {
                      name: `C'Thun`,
                      id: 'avatars/333/918/31110',
                      rarity: 'LEGENDARY',
                      set: 'OG',
                      cost: 10,
                      playerClass: 'NEUTRAL'
                    }
                  } as Card,
                  {
                    cardClass: 'NEUTRAL', cost: 'norm', name: 'Beckoner of Evil', rarity: 'comn', detail: {
                      name: 'Beckoner of Evil',
                      id: 'avatars/333/921/31114',
                      rarity: 'COMMON',
                      set: 'OG',
                      cost: 2,
                      playerClass: 'NEUTRAL'
                    }
                  } as Card,
                  {
                    cardClass: 'NEUTRAL', cost: 'norm', name: 'Beckoner of Evil', rarity: 'comn', detail: {
                      name: 'Beckoner of Evil',
                      id: 'avatars/333/921/31114',
                      rarity: 'COMMON',
                      set: 'OG',
                      cost: 2,
                      playerClass: 'NEUTRAL'
                    }
                  } as Card
                ] as unknown as Pack);
              }
              if (CardSet.isKNC(type)) {
                _packsProcessor([
                  {
                    cardClass: 'NEUTRAL', cost: 'norm', name: 'Marin the Fox', rarity: 'lgnd', detail: {
                      name: 'Marin the Fox',
                      id: 'avatars/353/214/636468816086287167',
                      rarity: 'LEGENDARY',
                      set: 'KNC',
                      cost: 8,
                      playerClass: 'NEUTRAL'
                    }
                  } as Card
                ] as unknown as Pack);
              }

              return [collection, klassBreakdown, rarityBreakdown, packsProcessor];
            }))
        ),
        rxMap(([pks, [, , , pksProc]]: [Packs, CollectionResetSignature]) => pksProc(pks)),
        multicast(() => new ReplaySubject<CollectionIOSignature>(1)),
        refCount()
      );

    this.events = this._events
      .pipe(rxMap(([coll]) => coll));

    this.klass = this._events
      .pipe(rxMap(([, cbd]) => cbd));

    this.rarity = this._events
      .pipe(rxMap(([, , rbd]) => rbd));

    this.packs = this._events
      .pipe(rxMap(([, , , packs]) => packs));
  }

  debug() {
    this.events.subscribe(d => console.log(d));
  }
}
