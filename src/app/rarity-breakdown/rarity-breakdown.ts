import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionService, CardsService, Collection, StatsService } from '../data';
import { Rarity, Cost } from '../data/types';
import { withLatestFrom, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CardsAccessor } from '../data/cards.service';

@Component({
  selector: 'pr-rarity-breakdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class RarityBreakdownComponent {
  public rarities = Rarity.shortList();
  private _events: Observable<Pick<CardsAccessor, 'filtered'> & { collection: Collection }>;
  private collection;
  private getRarity;
  private cards;
  private getName;

  constructor(cs : CollectionService, private ss : StatsService, cards : CardsService) {
    this._events = cs.events
      .pipe(
        withLatestFrom(cards.currentSet),
        map(([collection, { filtered }]) => ({ collection, filtered }))
      );

    this.collection = this._events
      .pipe(map(({ collection }) => collection));

    this.cards = this._events
      .pipe(map(({ filtered }) => filtered.byRarity));

    this.getRarity = Rarity.short;
    this.getName = Rarity.shortBack;
  }

  getCount(collection : Collection, name : string, cost : Cost) {
    return _.get(collection, [name, cost], 0);
  }

  getPercent(field : { target : number }, prop : string) {
    if (field[prop] === 0) {
      return '';
    } else {
      return `(${_.round(field[prop] / field.target * 100, 1)}%)`;
    }
  }
}
