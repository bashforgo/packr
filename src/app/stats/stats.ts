import { Component } from '@angular/core';
import { StatsService, CardsService } from '../data';
import { Rarity, CardClass, CardSet } from '../data/types';

type Field = {
  name: string;
  prop: string;
}

@Component({
  selector: 'pr-stats',
  template
})
export class StatsComponent {
  public fields = [{
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
  public rarities = [...Rarity.shortList(), 'total'];
  public classes;
  private long;

  constructor(private ss : StatsService, private cards : CardsService) {
    this.classes = cards.currentSet
      .map(({ type }) => CardClass.classList(CardSet.isMSG(type)));
    this.long = Rarity.shortBack;
  }

  getPercent(field : { target : number }, prop : string) {
    if (prop === 'target' || field[prop] === 0) {
      return '';
    } else {
      return `(${_.round(field[prop] / field.target * 100, 1)}%)`;
    }
  }
}
