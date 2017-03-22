import { Component, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { AnalyticsService } from '../analytics/analytics.service';

@Component({
  selector: 'pr-display-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class DisplaySettingsComponent {
  open: boolean = true;
  constructor(private analytics : AnalyticsService) {}

  toggle() {
    this.open = !this.open;
  }
}
