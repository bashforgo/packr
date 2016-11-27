import { Component } from '@angular/core';
import { CollectionService, CardsService, Collection } from '../data';
import { Rarity, Cost } from '../data/types';

@Component({
  selector: 'pr-rarity-breakdown',
  template
})
export class RarityBreakdownComponent {
  private _events;
  private collection;
  private getRarity;
  private cards;
  private rarities = Rarity.shortList();
  private getName;

  constructor(cs : CollectionService, cards : CardsService) {
    this._events = cs.rarity
      .zip(cards.currentSet)
      .map(([collection, { filtered }]) => ({ collection, filtered }));

    this.collection = this._events
      .map(({ collection }) => collection);

    this.cards = this._events
      .map(({ filtered }) => filtered.byRarity);

    this.getRarity = Rarity.short;
    this.getName = Rarity.shortBack;
  }

  getCount(collection : Collection, rarity : Rarity, name : string, cost : Cost) {
    return _.get(collection, [rarity, name, cost]) || 0;
  }
}
