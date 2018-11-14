import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pr-display-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class DisplaySettingsComponent {
  open: boolean = false;

  toggle() {
    this.open = !this.open;
  }
}
