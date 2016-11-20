import { Injectable } from '@angular/core';
import { PacksGeneratorService } from './';
import { DisplayCard, Packs, CardClassDictionary, CostDictionary, Rarity } from './types';
import { Observable } from 'rxjs';
import Dictionary = _.Dictionary;

type Card = DisplayCard;
type Collection = CardClassDictionary<CostDictionary<Dictionary<number>>>;

@Injectable()
export class CollectionService {
  public events;
  public packs;
  private _events;

  constructor(pgs : PacksGeneratorService) {
    //potentially memoize so that it is not recalculated for added packs
    this._events = pgs.events
      .map((packs : Packs) => {
          const collection : Collection = {};
          return [collection, _(packs)
            .map(pack => _(pack)
              .map(card => {
                const { cardClass, cost, detail, name, rarity } = card;
                const path = [cardClass, cost, name];
                const count = _.get<number>(collection, path) || 0;
                _.set(collection, path, count + 1);

                return {
                  extra: Rarity.max(rarity) <= count,
                  cardClass, cost, detail, name, rarity
                };
              }).value()
            ).value()];
        }
      ).share();

    this.events = this._events
      .map(([coll, ]) => coll);

    this.packs = this._events
      .map(([, packs]) => packs);
  }

  debug() {
    this.events.subscribe(d => console.log(d));
  }
}
