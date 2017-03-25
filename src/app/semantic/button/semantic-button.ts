import { Component, Input } from '@angular/core';

@Component({
  selector: 'pr-semantic-button',
  template
})
export class SemanticButtonComponent {
  @Input() innerClass: string;
  @Input() icon: string;
  @Input() disabled: boolean = false;
}
