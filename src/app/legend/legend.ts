import { Component, HostListener, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { AnalyticsService } from '../analytics/analytics.service';

@Component({
  selector: 'pr-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class LegendComponent {
  @HostBinding('class.open')
  private showingLegend = false;

  constructor(private analytics: AnalyticsService) { }

  @HostListener('click')
  toggle() {
    this.showingLegend = !this.showingLegend;

    if (this.showingLegend) {
      this.analytics.legend();
    }
  }
}
