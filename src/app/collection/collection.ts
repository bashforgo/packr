import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CardsService, CollectionService, Collection } from '../data';
import { Cost, Rarity, JSONCard } from '../data/types';
import { Search } from '../search/bar/search-bar';

@Component({
  selector: 'pr-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class CollectionComponent {
  private _events: Observable<{
    collection: Collection;
    sorted: JSONCard[];
  }>;
  private collection: Observable<Collection>;
  private cards: Observable<JSONCard[]>;
  private getRarity = Rarity.short;
  private search: Search = { text: '', sts: null };

  constructor(private cs: CollectionService, cards: CardsService) {
    const _events = cs.events
      .pipe(
        withLatestFrom(cards.currentSet),
        map(([collection, { sorted }]) => ({
          collection, sorted
        }))
      );

    this.collection = this._events
      .pipe(map(({ collection }) => collection));

    this.cards = this._events
      .pipe(map(({ sorted }) => sorted));
  }

  getCount(collection: {}, name: string, cost: Cost) {
    return _.get(collection, [name, cost], 0);
  }

  onTerms(search: Search) {
    this.search = search;
  }
}
