import { ChangeDetectionStrategy, Component } from '@angular/core';
import { includes, round } from 'lodash';
import { map } from 'rxjs/operators';
import { CardsService, StatsService } from '../data';
import { CardClass, CardSet, Rarity } from '../data/types';

type Field = {
  name: string;
  prop: string;
};

@Component({
  selector: 'pr-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class StatsComponent {
  public completionFields = [{
    name: 'any',
    prop: 'any'
  }, {
    name: 'regular',
    prop: 'norm'
  }, {
    name: 'golden',
    prop: 'gold'
  }, {
    name: 'target',
    prop: 'target'
  }] as Field[];
  public dustFields = [{
    name: 'total',
    prop: 'total'
  }, {
    name: 'regular',
    prop: 'norm'
  }, {
    name: 'regular extra',
    prop: 'normExtra'
  }, {
    name: 'golden',
    prop: 'gold'
  }, {
    name: 'golden extra',
    prop: 'goldExtra'
  }, {
    name: 'extras',
    prop: 'totalExtra'
  }] as Field[];
  public cardFields = this.dustFields.slice(0, -1) as Field[];
  public rarities = [...Rarity.shortList(), 'total'];
  public classes;
  public long;

  constructor(public ss: StatsService, cards: CardsService) {
    this.classes = cards.currentSet
      .pipe(map(({ type }) => CardClass.classList(CardSet.isMSG(type))));
    this.long = Rarity.shortBack;
  }

  getCompletionPercentage(field: { target: number }, prop: string) {
    if (prop === 'target' || field[prop] === 0) {
      return '';
    } else {
      return `(${round(field[prop] / field.target * 100, 1)}%)`;
    }
  }

  getCardPercentage(data: any, rarity: string, field: string) {
    if ((rarity === 'total' && field === 'total') || data[rarity][field] === 0) {
      return '';
    } else if (includes(field, 'Extra')) {
      return `(${round(data[rarity][field] / data[rarity][field.replace('Extra', '')] * 100, 1)}%)`;
    } else if (field === 'gold') {
      return `(${round(data[rarity][field] / data[rarity].total * 100, 1)}%)`;
    } else {
      return `(${round(data[rarity][field] / data.total.total * 100, 1)}%)`;
    }
  }
}
