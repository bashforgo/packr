import { ChangeDetectionStrategy, Component } from '@angular/core';
import { get, round } from 'lodash';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import { CardsService, Collection, CollectionService, StatsService } from '../data';
import { CardsAccessor } from '../data/cards.service';
import { CardClass, CardClassDictionary, CardSet, Cost, JSONCard, Rarity } from '../data/types';

@Component({
  selector: 'pr-class-breakdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class ClassBreakdownComponent {
  private _events: Observable<{ collection: Collection, classes: CardClass[] } & Pick<CardsAccessor, 'filtered'>>;
  private collection: Observable<Collection>;
  private classes: Observable<CardClass[]>;
  private cards: Observable<CardClassDictionary<JSONCard[]>>;
  private getRarity = Rarity.short;

  constructor(private cs: CollectionService, private ss: StatsService, cards: CardsService) {
    this._events = cs.events
      .pipe(
        withLatestFrom(cards.currentSet),
        map(([collection, { filtered, type }]) => ({
          collection, filtered, classes: CardClass.classList(CardSet.isMSG(type))
        }))
      );

    this.collection = this._events
      .pipe(map(({ collection }) => collection));

    this.cards = this._events
      .pipe(map(({ filtered }) => filtered.byClass));

    this.classes = this._events
      .pipe(map(({ classes }) => classes));
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
