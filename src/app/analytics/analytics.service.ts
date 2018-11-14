import { Injectable } from '@angular/core';
import { CardSet } from '../data/types';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AnalyticsService {
  private analytics = require('universal-ga');
  private initial = true;
  private packRules: boolean;

  constructor(route: ActivatedRoute) {
    this.analytics.initialize('UA-48744326-4');
    route.queryParams.subscribe((params) => this.packRules = params.packRules !== 'old');
  }

  view(page: string) {
    this.analytics.set('page', this.labelIfOld(page));
    this.analytics.pageview();
  }

  open(amount: number, type: CardSet) {
    this.analytics.event(
      'packs', this.initial ? 'initial' : 'open', {
        eventValue: amount,
        eventLabel: this.labelIfOld(CardSet.label(type))
      }
    );
    this.initial = false;
  }

  add(type: CardSet) {
    this.analytics.event('packs', 'add', { eventValue: 1, eventLabel: this.labelIfOld(CardSet.label(type)) });
  }

  card(name: string) {
    this.analytics.event('card', 'click', { eventLabel: name });
  }

  legend() {
    this.analytics.event('analytics', 'view');
  }

  social(type: string, label: string = null) {
    this.analytics.event('social', type, label ? { eventLabel: label } : undefined);
  }

  private labelIfOld(v: string) {
    return `${v}${!this.packRules ? ' (old rules)' : ''}`;
  }
}
