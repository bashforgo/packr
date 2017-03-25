import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pr-semantic-button',
  template
})
export class SemanticButtonComponent {
  @Input('class') klass: string;
  @Input() icon: string;
  @Input() disabled: boolean = false;
}
