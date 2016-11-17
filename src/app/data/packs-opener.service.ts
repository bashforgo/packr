import { Injectable } from '@angular/core';
import { CardSet } from './types';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PacksOpeningEvent {
  type : CardSet;
  amount : number;
}

@Injectable()
export class PacksOpenerService {
  static initial : PacksOpeningEvent = {
    type: CardSet.MSG,
    amount: 50
  };

  public events : Observable<PacksOpeningEvent>;
  private _events = new BehaviorSubject<PacksOpeningEvent>(PacksOpenerService.initial);

  constructor() {
    this.events = this._events.asObservable();
  }

  next(data : PacksOpeningEvent) {
    this._events.next(data);
  }

  current() {
    return this._events.getValue();
  }
}
