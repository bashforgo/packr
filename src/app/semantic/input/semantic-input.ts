import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ary, chain, toNumber } from 'lodash';

export interface SemanticInputErrorLabel {
  [errorKey: string]: string;
}

@Component({
  selector: 'pr-semantic-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class SemanticInputComponent implements OnInit {
  @Input() innerClass: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() type: string = 'text';
  @Input() placeholder: string;
  @Input() control: FormControl;
  @Input() errorLabels: SemanticInputErrorLabel;
  value: any;

  ngOnInit(): void {
    this.value = this.control.value;
  }

  setValue(event: any) {
    this.value = this.type === 'number' ? toNumber(event) : event;
    this.control.setValue(this.value);
  }

  get activeErrorLabels() {
    return chain(this.errorLabels)
      .keys()
      .filter(ary(this.control.hasError.bind(this.control), 1))
      .value();
  }
}
