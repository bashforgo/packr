import { Injectable } from '@angular/core';
import { PackType } from './pack-types-enum';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PacksOpeningEvent {
  type : PackType;
  amount : number;
}

@Injectable()
export class PacksOpenerService {
  static initial : PacksOpeningEvent = {
    type: PackType.MSG,
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
