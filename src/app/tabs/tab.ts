import { Component, Input } from '@angular/core';

@Component({
  selector: 'pr-tab',
  template
})
export class TabComponent {
  @Input() tabTitle: string;
  @Input() active = false;
}
