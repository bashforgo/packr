import { Component, HostListener, HostBinding, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pr-legend',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class LegendComponent {
  @HostBinding('class.open')
  private showingLegend = false;

  @HostListener('click')
  toggle() {
    this.showingLegend = !this.showingLegend;
  }
}
