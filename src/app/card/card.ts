import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ShortRarity, Cost, ShortRarityDictionary, Rarity } from '../data/types';

@Component({
  selector: 'pr-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class CardComponent {
  @Input() cost : Cost;
  @Input() name : string;
  @Input() count : number = null;
  @Input() extra : boolean;
  @Input() goldCount : number = null;
  @Input() rarity : ShortRarity;

  colors : ShortRarityDictionary<string> = {
    comn: 'grey',
    rare: 'blue',
    epic: 'purple',
    lgnd: 'orange'
  };

  emphasis() : string {
    if (this.isPackMode()) {
      return `${this.isGold() ? '' : 'tertiary '}inverted`;
    } else {
      const total = this.count + this.goldCount;
      const max = Rarity.max(this.rarity);
      if (total > 0) {
        return `${ total >= max ? '' : 'tertiary '}inverted`;
      } else {
        return '';
      }
    }
  }

  icon() : string | null {
    if (this.isPackMode()) {
      return this.isGold() ? 'star' : null;
    } else {
      return null;
    }
  }

  isGold() : boolean {
    return this.cost === 'gold';
  }

  isPackMode() {
    return _.isNull(this.count) && _.isNull(this.goldCount);
  }
}
