import { Injectable } from '@angular/core';
import { PacksGeneratorService } from './';
import { DisplayCard, Packs, CardClassDictionary, CostDictionary, Rarity, Cost } from './types';
import Dictionary = _.Dictionary;

type Card = DisplayCard;
type Collection = CardClassDictionary<CostDictionary<Dictionary<number>>>;

@Injectable()
export class CollectionService {
  public events;
  public packs;
  public rarityBreakdown;
  private _events;

  constructor(pgs : PacksGeneratorService) {
    //potentially memoize so that it is not recalculated for added packs
    this._events = pgs.events
      .map((packs : Packs) => {
          const collection : Collection = {};
          const rarityBreakdown = {};
          return [collection, rarityBreakdown, _(packs)
            .map(pack => _(pack)
              .map(card => {
                const { cardClass, cost, detail, name, rarity } = card;
                const path = [cardClass, cost, name];
                const count = (_.get<number>(collection, path) || 0) + 1;
                _.set(collection, path, count);

                path[0] = rarity;
                _.set(rarityBreakdown, path, count);
                path[1] = Cost.other(cost);
                const otherCount = _.get<number>(rarityBreakdown, path) || 0;
                path[1] = 'total';
                _.set(rarityBreakdown, path, count + otherCount);

                return {
                  extra: Rarity.isExtra(rarity, count + 1),
                  cardClass, cost, detail, name, rarity
                };
              }).value()
            ).value()];
        }
      ).share();

    this.events = this._events
      .map(([coll, ]) => coll);

    this.rarityBreakdown = this._events
      .map(([, rbd]) => rbd);

    this.packs = this._events
      .map(([, , packs]) => packs);
  }

  debug() {
    this.events.subscribe(d => console.log(d));
  }
}
