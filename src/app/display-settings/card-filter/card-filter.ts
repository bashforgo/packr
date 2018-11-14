import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CardFilterService } from './card-filter.service';
import { ShortRarity, Rarity } from '../../data/types';

@Component({
  selector: 'pr-card-filter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class CardFilterComponent {
  props = _.map(['comn', 'rare', 'epic', 'lgnd', 'gold', 'all'], prop => {
    const isRarity = ShortRarity.isA(prop);
    const isGold = prop === 'gold';
    const titleCase: (s: string) => string = _.flow(_.snakeCase, _.startCase);
    const name = titleCase(isRarity ? Rarity.shortBack(prop as ShortRarity) : (isGold ? 'only golden' : prop));
    const rarity = isRarity ? prop : (isGold ? 'epic' : 'lgnd');
    return {
      prop,
      on: {
        name, rarity, cost: isGold ? 'gold' : 'norm', extra: false
      },
      off: {
        name, rarity, cost: isGold ? 'gold' : 'norm', extra: true
      }
    };
  });

  constructor(public cfs : CardFilterService) {
  }

  toggle(prop : string, value : boolean) {
    if (ShortRarity.isA(prop) && this.cfs.all()) {
      this.cfs.all(false);
      this.cfs[prop](!value);
    } else {
      this.cfs[prop](value);
    }
  }
}
