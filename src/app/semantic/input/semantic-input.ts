import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface SemanticInputErrorLabel {
  [errorKey : string] : string;
}

@Component({
  selector: 'pr-semantic-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class SemanticInputComponent implements OnInit {
  @Input() innerClass : string;
  @Input() label : string;
  @Input() icon : string;
  @Input() type : string = 'text';
  @Input() placeholder : string;
  @Input() control : FormControl;
  @Input() errorLabels : SemanticInputErrorLabel;
  value : any;

  ngOnInit() : void {
    this.value = this.control.value;
  }

  setValue(event : any) {
    this.value = this.type === 'number' ? _.toNumber(event) : event;
    this.control.setValue(this.value);
  }

  get activeErrorLabels() {
    return _.chain(this.errorLabels)
      .keys()
      .filter(_.ary(this.control.hasError.bind(this.control), 1))
      .value();
  }
}
