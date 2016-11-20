import { Injectable } from '@angular/core';
import { CardSet } from './types';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface PacksOpeningEvent {
  type : CardSet;
  amount : number;
}

@Injectable()
export class PacksOpenerService {
  static initial : PacksOpeningEvent = {
    type: CardSet.WOG,
    amount: 1
  };

  public events : Observable<PacksOpeningEvent>;
  public addEvents : Observable<number>;
  private _events = new BehaviorSubject<PacksOpeningEvent>(PacksOpenerService.initial);
  private _addEvents : Observable<number>;
  private _currentAdder : Subject<number>;

  constructor() {
    this.events = this._events
      .asObservable();

    this._addEvents = this._events
      .switchMap<number>(() => {
        this._currentAdder = new BehaviorSubject(0);

        return this._currentAdder
          .scan((prev, curr) => prev + curr, 0);
      });

    this.addEvents = this._addEvents.share();
  }

  next(data : PacksOpeningEvent) {
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
  }
}
