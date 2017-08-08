import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardsService, CollectionService } from '../data';
import { Cost, Rarity } from '../data/types';
import { Search } from '../search/bar/search-bar';

@Component({
  selector: 'pr-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class CollectionComponent {
  private _events;
  private collection;
  private cards;
  private getRarity;
  private search : Search = { text: '', sts: null };

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

  onTerms(search : Search) {
    this.search = search;
  }
}
