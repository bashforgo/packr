import { Component } from '@angular/core';
import { CollectionService, CardsService, Collection, StatsService } from '../data';
import { Rarity, Cost } from '../data/types';

@Component({
  selector: 'pr-rarity-breakdown',
  template
})
export class RarityBreakdownComponent {
  public rarities = Rarity.shortList();
  private _events;
  private collection;
  private getRarity;
  private cards;
  private getName;

  constructor(cs : CollectionService, private ss : StatsService, cards : CardsService) {
    this._events = cs.rarity
      .withLatestFrom(cards.currentSet)
      .map(([collection, { filtered }]) => ({ collection, filtered }));

    this.collection = this._events
      .map(({ collection }) => collection);

    this.cards = this._events
      .map(({ filtered }) => filtered.byRarity);

    this.getRarity = Rarity.short;
    this.getName = Rarity.shortBack;
  }

  getCount(collection : Collection, rarity : Rarity, name : string, cost : Cost) {
    return _.get(collection, [rarity, name, cost], 0);
  }

  getPercent(field : { target : number }, prop : string) {
    if (field[prop] === 0) {
      return '';
    } else {
      return `(${_.round(field[prop] / field.target * 100, 1)}%)`;
    }
  }
}
