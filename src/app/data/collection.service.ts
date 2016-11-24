import { Injectable } from '@angular/core';
import { PacksGeneratorService, PacksOpenerService } from './';
import { DisplayCard, Packs, CardClassDictionary, CostDictionary, Rarity, Cost, Pack } from './types';
import Dictionary = _.Dictionary;
import { ReplaySubject } from 'rxjs';

type Card = DisplayCard;
export type Collection = CardClassDictionary<CostDictionary<Dictionary<number>>>;
type CollectionIOSignature = [Collection, {}, Packs];
type CollectionResetSignature =
  [Collection, {}, ((pks : Packs) => CollectionIOSignature)];

@Injectable()
export class CollectionService {
  public events;
  public packs;
  public rarity;
  private _events;

  constructor(pgs : PacksGeneratorService, pos : PacksOpenerService) {
    this._events = pgs.events
      .withLatestFrom(
        pos.events
          .map(() => {
            const collection = {};
            const rarityBreakdown = {};
            const _packsProcessor = _.memoize((pack : Pack) => {
              return _.map(
                pack,
                (card : Card) => {
                  const { cardClass, cost, detail, name, rarity } = card;
                  let path = [cardClass, name, cost];
                  const count = (_.get<number>(collection, path) || 0) + 1;
                  _.set(collection, path, count);

                  path = [rarity, cost, name];
                  _.set(rarityBreakdown, path, count);
                  path[1] = Cost.other(cost);
                  const otherCount = _.get<number>(rarityBreakdown, path) || 0;
                  path[1] = 'total';
                  _.set(rarityBreakdown, path, count + otherCount);

                  return {
                    extra: Rarity.isExtra(rarity, count),
                    cardClass, cost, detail, name, rarity
                  };
                }
              );
            });

            const packsProcessor = (pks) => [collection, rarityBreakdown, _.map(pks, _packsProcessor)];

            return [collection, rarityBreakdown, packsProcessor];
          })
      )
      .map(([pks, [, , pksProc]] : [Packs, CollectionResetSignature]) => pksProc(pks))
      .multicast(() => new ReplaySubject<CollectionIOSignature>(1))
      .refCount();

    this.events = this._events
      .map(([coll, ]) => coll);

    this.rarity = this._events
      .map(([, rbd]) => rbd);

    this.packs = this._events
      .map(([, , packs]) => packs);
  }

  debug() {
    this.events.subscribe(d => console.log(d));
  }
}
