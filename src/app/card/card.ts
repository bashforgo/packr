import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ShortRarity, Cost, ShortRarityDictionary } from '../data/types';

@Component({
  selector: 'pr-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class CardComponent {
  @Input() cost : Cost;
  @Input() name : string;
  @Input() count : number;
  @Input() extra : boolean;
  @Input() goldCount : number;
  @Input() rarity : ShortRarity;

  colors : ShortRarityDictionary<string> = {
    comn: 'grey',
    rare: 'blue',
    epic: 'purple',
    lgnd: 'orange'
  };

  emphasis() : string {
    if (_.isUndefined(this.count) && _.isUndefined(this.goldCount)) {
      return `${this.isGold() ? '' : 'tertiary '}inverted`;
    } else {
      return '';
    }
  }

  icon() : string | null {
    if (_.isUndefined(this.count) && _.isUndefined(this.goldCount)) {
      return this.isGold() ? 'star' : null;
    } else {
      return null;
    }
  }

  isGold() : boolean {
    return this.cost === 'gold';
  }

  isLgnd() : boolean {
    return this.rarity === 'lgnd';
  }
}
