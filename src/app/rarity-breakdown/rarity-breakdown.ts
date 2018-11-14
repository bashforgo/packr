import { ChangeDetectionStrategy, Component } from '@angular/core';
import { get, round } from 'lodash';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CardsService, Collection, CollectionService, StatsService } from '../data';
import { CardsAccessor } from '../data/cards.service';
import { Cost, Rarity } from '../data/types';

@Component({
  selector: 'pr-rarity-breakdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class RarityBreakdownComponent {
  public rarities = Rarity.shortList();
  public collection;
  public cards;
  public getName = Rarity.shortBack;
  private _events: Observable<Pick<CardsAccessor, 'filtered'> & { collection: Collection }>;

  constructor(public ss: StatsService, cs: CollectionService, cards: CardsService) {
    this._events = cs.events
      .pipe(
        withLatestFrom(cards.currentSet),
        map(([collection, { filtered }]) => ({ collection, filtered }))
      );

    this.collection = this._events
      .pipe(map(({ collection }) => collection));

    this.cards = this._events
      .pipe(map(({ filtered }) => filtered.byRarity));
  }

  getCount(collection: Collection, name: string, cost: Cost) {
    return get(collection, [name, cost], 0);
  }

  getPercent(field: { target: number }, prop: string) {
    if (field[prop] === 0) {
      return '';
    } else {
      return `(${round(field[prop] / field.target * 100, 1)}%)`;
    }
  }
}
