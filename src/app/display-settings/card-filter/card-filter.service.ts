import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ShortRarityDictionary } from '../../data/types';
import { DisplayCard } from '../../data/types/card';
import { Pack } from '../../data/types/pack';
import { PackWithDust } from '../../data/best-packs.service';

class Filters {
  byRarity : ShortRarityDictionary<boolean>;
  gold : boolean;
  showCard : (this : Filters, card : DisplayCard) => boolean;
  showPack : (this : Filters, pack : Pack) => boolean;

  constructor(comn : boolean, rare : boolean, epic : boolean, lgnd : boolean, gold : boolean) {
    this.byRarity = { comn, rare, epic, lgnd };
    this.gold = gold;
    this.showCard = this._showCard.bind(this);
    this.showPack = this._showPack.bind(this);
  }

  static get defaults() {
    return new Filters(true, true, true, true, false);
  }

  static get none() {
    return new Filters(false, false, false, false, false);
  }

  get all() : boolean {
    return _.isEqual(this.byRarity, Filters.defaults.byRarity) && !this.gold;
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

  _showCard(card : DisplayCard) {
    if (this.gold) {
      return card.cost === 'gold' && this.byRarity[card.rarity];
    }
    return this.byRarity[card.rarity];
  }

  _showPack(pack: Pack | PackWithDust) : boolean {
    return _.some((pack as PackWithDust).pack || pack, card => this.showCard(card));
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
