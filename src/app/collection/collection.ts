import { Component } from '@angular/core';
import { CardsService, CollectionService } from '../data';
import { CardClass, CardSet, Cost, Rarity } from '../data/types';

@Component({
  selector: 'pr-collection',
  template
})
export class CollectionComponent {
  private _events;
  private collection;
  private cards;
  private getRarity;

  constructor(private cs : CollectionService, cards : CardsService) {
    this._events = cs.events
      .withLatestFrom(cards.currentSet)
      .map(([collection, { sorted }]) => ({
          collection, sorted
        })
      );

    this.collection = this._events
      .map(({ collection }) => collection);

    this.cards = this._events
      .map(({ sorted }) => sorted);

    this.getRarity = Rarity.short;
  }

  getCount(collection : {}, name : string, cost : Cost) {
    return _.get(collection, [name, cost], 0);
  }
}
