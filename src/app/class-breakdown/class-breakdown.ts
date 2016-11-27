import { Component } from '@angular/core';
import { CollectionService, CardsService, Collection } from '../data';
import { CardClass, CardSet, Rarity, Cost } from '../data/types';

@Component({
  selector: 'pr-class-breakdown',
  template
})
export class ClassBreakdownComponent {
  private _events;
  private collection;
  private classes;
  private cards;
  private getRarity;

  constructor(private cs : CollectionService, cards : CardsService) {
    this._events = cs.events
      .zip(cards.currentSet)
      .map(([collection, { filtered, type }]) => ({
          collection, filtered, classes: CardClass.classList(CardSet.isMSG(type))
        })
      );

    this.collection = this._events
      .map(({ collection }) => collection);

    this.cards = this._events
      .map(({ filtered }) => filtered.byClass);

    this.classes = this._events
      .map(({ classes }) => classes);

    this.getRarity = Rarity.short;
  }

  getCount(collection : Collection, cardClass : CardClass, name : string, cost : Cost) {
    return _.get(collection, [cardClass, name, cost]) || 0;
  }
}
