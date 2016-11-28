import { Injectable } from '@angular/core';
import { CardSet } from '../data/types';

@Injectable()
export class AnalyticsService {
  private analytics = require('universal-ga');
  private initial = true;

  constructor() {
    this.analytics.initialize('UA-48744326-4');
  }

  view(page : string) {
    this.analytics.set('page', page);
    this.analytics.pageview();
  }

  open(amount : number, type : CardSet) {
    this.analytics.event(
      'packs', this.initial ? 'initial' : 'open', { eventValue: amount, eventLabel: CardSet.label(type) }
    );
  }

  add(type : CardSet) {
    this.analytics.event('packs', 'add', { eventValue: 1, eventLabel: CardSet.label(type) });
  }

  card(name : string) {
    this.analytics.event('card', 'click', { eventLabel: name });
  }

  social(type : string, label : string = null) {
    this.analytics.event('social', type, label ? { eventLabel: label } : undefined);
  }
}
