import { Injectable } from '@angular/core';
import { PacksGeneratorService, PacksOpenerService } from './';
import {
  DisplayCard,
  Packs,
  CardClassDictionary,
  CostDictionary,
  Rarity,
  Pack,
  CardClass,
  CardSet,
  ShortRarityDictionary
} from './types';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';
import Dictionary = _.Dictionary;

type Card = DisplayCard;
export type Collection = CardClassDictionary<CostDictionary<Dictionary<number>>>;
type CollectionIOSignature = [Collection, {}, Packs];
type CollectionResetSignature =
  [{}, Collection, {}, ((pks : Packs) => CollectionIOSignature)];

@Injectable()
export class CollectionService {
  public events;
  public klass;
  public packs;
  public rarity;
  private _events;

  constructor(pgs : PacksGeneratorService, pos : PacksOpenerService) {
    this._events = pgs.events
      .withLatestFrom<Packs, CollectionResetSignature>(
        pos.events
          .map(({ type }) => {
            const collection : {[cardName: string]: CostDictionary<number>} = {};
            const klassBreakdown = _.transform(
              CardClass.classList(CardSet.isMSG(type)),
              (res, name) => res[name] = {},
              {}
            ) as CardClassDictionary<Dictionary<CostDictionary<number>>>;
            const rarityBreakdown = _.transform(
              Rarity.shortList(),
              (res, name) => res[name] = {},
              {}
            ) as ShortRarityDictionary<Dictionary<CostDictionary<number>>>;
            const _packsProcessor = _.memoize((pack : Pack) => {
              return _.map(
                pack,
                (card : Card) => {
                  const { cardClass, cost, detail, name, rarity } = card;
                  const path = [name, cost];
                  const count = _.get(collection, path, 0) + 1;
                  _.set(collection, path, count);

                  path.unshift(cardClass);
                  _.set(klassBreakdown, path, count);

                  path[0] = rarity;
                  _.set(rarityBreakdown, path, count);

                  return {
                    extra: Rarity.isExtra(rarity, count),
                    cardClass, cost, detail, name, rarity
                  };
                }
              );
            });

            const packsProcessor = (pks) => [collection, klassBreakdown, rarityBreakdown, _.map(pks, _packsProcessor)];

            return [collection, klassBreakdown, rarityBreakdown, packsProcessor];
          })
      )
      .map(([pks, [, , , pksProc]] : [Packs, CollectionResetSignature]) => pksProc(pks))
      .multicast(() => new ReplaySubject<CollectionIOSignature>(1))
      .refCount();

    this.events = this._events
      .map(([coll]) => coll)

    this.klass = this._events
      .map(([, cbd]) => cbd);

    this.rarity = this._events
      .map(([, , rbd]) => rbd);

    this.packs = this._events
      .map(([, , , packs]) => packs);
  }

  debug() {
    this.events.subscribe(d => console.log(d));
  }
}
