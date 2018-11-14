import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { includes } from 'lodash';
import { AnalyticsService } from '../analytics/analytics.service';
import { Cost, Rarity, ShortRarity, ShortRarityDictionary } from '../data/types';

const BASE_URL = 'https://images.weserv.nl/?trim=1&url=media.services.zam.com/v1/media/byName/hs/cards/enus/';
const ALT_URL = 'https://images.weserv.nl/?trim=1&url=media-hearth.cursecdn.com/';
const EXT = '.png';

@Component({
  selector: 'pr-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class CardComponent {
  @Input() cost: Cost;
  @Input() name: string;
  @Input() count: number = null;
  @Input() extra: boolean;
  @Input() cardId: string;
  @Input() rarity: ShortRarity;
  @Input() goldCount: number = null;
  imageOpen = false;

  static activeCard: CardComponent = null;

  colors: ShortRarityDictionary<string> = {
    comn: 'grey',
    rare: 'blue',
    epic: 'purple',
    lgnd: 'orange'
  };

  constructor(private analytics: AnalyticsService) { }

  emphasis(): string {
    if (this.isPackMode()) {
      return `${this.isGold() ? '' : 'tertiary '}inverted`;
    } else {
      const total = this.count + this.goldCount;
      const max = Rarity.max(this.rarity);
      if (total > 0) {
        return `${total >= max ? '' : 'tertiary '}inverted`;
      } else {
        return '';
      }
    }
  }

  icon(): string | null {
    if (this.isPackMode()) {
      return this.isGold() ? 'star' : null;
    } else {
      return null;
    }
  }

  isGold(): boolean {
    return this.cost === 'gold';
  }

  isPackMode() {
    return this.count === null && this.goldCount === null;
  }

  getImage() {
    if (includes(this.cardId, 'avatars')) {
      return `${ALT_URL}${this.cardId}${EXT}`;
    } else {
      return `${BASE_URL}${this.cardId}${EXT}`;
    }
  }

  openImage(event?: MouseEvent) {
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

  closeImage(event?: MouseEvent) {
    this.imageOpen = false;

    if (event) {
      event.preventDefault();
    }
  }
}
