import { Component, HostListener, HostBinding } from '@angular/core';

@Component({
  selector: 'pr-legend',
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
