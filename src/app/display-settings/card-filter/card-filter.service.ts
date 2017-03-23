import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShortRarityDictionary } from '../../data/types';

class Filters {
  byRarity : ShortRarityDictionary<boolean>;
  gold : boolean;

  constructor(comn : boolean, rare : boolean, epic : boolean, lgnd : boolean, gold : boolean) {
    this.byRarity = { comn, rare, epic, lgnd };
    this.gold = gold;
  }

  static get defaults() {
    return new Filters(true, true, true, true, false);
  }

  static get none() {
    return new Filters(false, false, false, false, false);
  }

  get all() : boolean {
    return _.isEqual(this, Filters.defaults);
  }

  set all(value : boolean) {
    if (value) {
      this.byRarity = Filters.defaults.byRarity;
      this.gold = false;
    } else {
      this.byRarity = Filters.none.byRarity;
      this.gold = false;
    }
  }
}

@Injectable()
export class CardFilterService {
  comn = this.getterSetter(['byRarity', 'comn']);
  rare = this.getterSetter(['byRarity', 'rare']);
  epic = this.getterSetter(['byRarity', 'epic']);
  lgnd = this.getterSetter(['byRarity', 'lgnd']);
  gold = this.getterSetter(['gold']);
  all = this.getterSetter(['all']);

  readonly events;
  private _value;
  constructor() {
    this._value = Filters.defaults;
    this.events = new BehaviorSubject<Filters>(this._value);
  }

  private getterSetter(prop : string[]) {
    return (val? : boolean) => {
      if (!_.isUndefined(val)) {
        _.set(this._value, prop, val);
        this.events.next(this._value);
      } else {
        return _.get(this._value, prop);
      }
    };
  }
}
