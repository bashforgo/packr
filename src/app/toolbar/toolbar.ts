import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AnalyticsService } from '../analytics/analytics.service';

@Component({
  selector: 'pr-toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class ToolbarComponent {
  constructor(private analytics : AnalyticsService) {}

  github() {
    this.analytics.social('github', 'click');
  }
}
