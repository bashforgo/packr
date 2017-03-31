import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService } from '../analytics/analytics.service';

@Component({
  selector: 'pr-display-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class DisplaySettingsComponent {
  open: boolean = false;
  constructor(private analytics : AnalyticsService) {}

  toggle() {
    this.open = !this.open;
  }
}
