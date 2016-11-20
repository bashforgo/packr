import { Injectable } from '@angular/core';
import { PacksGeneratorService } from './';
import { DisplayCard } from './types';

type Card = DisplayCard;

@Injectable()
export class CollectionService {
  public events;

  constructor(pgs : PacksGeneratorService) {
    this.events = pgs.events
      .map(packs => {
        return _(packs)
          .flatten()
          .transform((collection, card : Card) => {
            const path = [card.cardClass, card.cost, card.name];
            const count = _.get<number>(collection, path) || 0;
            _.set(collection, path, count + 1);
          }, {})
          .value();
      });
  }

  debug() {
    this.events.subscribe(d => console.log(d));
  }
}
