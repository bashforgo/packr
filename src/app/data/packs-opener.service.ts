import { Injectable } from '@angular/core';
import { CardSet } from './types';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, scan, share } from 'rxjs/operators';

import { AnalyticsService } from '../analytics/analytics.service';

export interface PacksOpeningEvent {
  type: CardSet;
  amount: number;
}

@Injectable()
export class PacksOpenerService {
  static initial: PacksOpeningEvent = {
    type: CardSet.TBP,
    amount: 70
  };

  public events: Observable<PacksOpeningEvent>;
  public addEvents: Observable<number>;
  private _events = new BehaviorSubject<PacksOpeningEvent>(PacksOpenerService.initial);
  private _addEvents: Observable<number>;
  private _currentAdder: Subject<number>;

  constructor(private analytics: AnalyticsService) {
    this.events = this._events
      .asObservable();

    this._events.subscribe(({ type, amount }) => analytics.open(amount, type));

    this._addEvents = this._events
      .pipe(
        switchMap(() => {
          this._currentAdder = new BehaviorSubject(0);

          return this._currentAdder
            .pipe(scan((prev, curr) => prev + curr, 0))
        })
      );

    this.addEvents = this._addEvents.pipe(share());
  }

  next(data: PacksOpeningEvent) {
    this._events.next(data);
  }

  current() {
    return this._events.getValue();
  }

  debug() {
    this.events.subscribe(d => console.log('poe', d));
  }

  oneMore() {
    this._currentAdder.next(1);
    this.analytics.add(this.current().type);
  }
}
