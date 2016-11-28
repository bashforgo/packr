import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ShortRarity, Cost, ShortRarityDictionary, Rarity } from '../data/types';
import { AnalyticsService } from '../analytics/analytics.service';

const BASE_URL = 'https://wow.zamimg.com/images/hearthstone/cards/enus/medium/';
const BASE_CURSE_URL = 'https://media-hearth.cursecdn.com/';
const EXT = '.png';

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
  @Input() cardId : string;
  @Input() rarity : ShortRarity;
  @Input() goldCount : number = null;
  imageOpen = false;

  static activeCard : CardComponent = null;

  colors : ShortRarityDictionary<string> = {
    comn: 'grey',
    rare: 'blue',
    epic: 'purple',
    lgnd: 'orange'
  };

  constructor(private analytics : AnalyticsService) {}

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
    return this.count === null && this.goldCount === null;
  }

  getImage() {
    return `${_.includes(this.cardId, 'avatar') ? BASE_CURSE_URL : BASE_URL}${this.cardId}${EXT}`;
  }

  openImage(event? : MouseEvent) {
    if ((event && event.defaultPrevented) || !this.cardId) {
      return null;
    }
    if (CardComponent.activeCard) {
      CardComponent.activeCard.closeImage();
    }
    if (this.cardId) {
      this.imageOpen = true;
      CardComponent.activeCard = this;
      this.analytics.card(this.name);
    }
  }

  closeImage(event? : MouseEvent) {
    this.imageOpen = false;

    if (event) {
      event.preventDefault();
    }
  }
}
