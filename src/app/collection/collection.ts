import { ChangeDetectionStrategy, Component } from '@angular/core';
import { get } from 'lodash';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CardsService, Collection, CollectionService } from '../data';
import { Cost, JSONCard, Rarity } from '../data/types';
import { Search } from '../search/bar/search-bar';

@Component({
  selector: 'pr-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class CollectionComponent {
  public collection: Observable<Collection>;
  public cards: Observable<JSONCard[]>;
  public getRarity = Rarity.short;
  public search: Search = { text: '', sts: null };
  private _events: Observable<{
    collection: Collection;
    sorted: JSONCard[];
  }>;

  constructor(cs: CollectionService, cards: CardsService) {
    this._events = cs.events
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
    return get(collection, [name, cost], 0);
  }

  onTerms(search: Search) {
    this.search = search;
  }
}
