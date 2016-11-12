import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SemanticRadioGroupOption } from '../semantic/radio-group/semantic-radio-group';
import { SemanticInputErrorLabel } from '../semantic/input/semantic-input';

@Component({
  selector: 'pr-packs-opener',
  template,
  styles
})
export class PacksOpenerComponent {
  form : FormGroup;
  types = ['MSG', 'WOG', 'TGT', 'CLASSIC'];
  options : SemanticRadioGroupOption[] = _.map(this.types, t => ({ label: t, value: t }));
  errors : SemanticInputErrorLabel = {
    rangeError: 'Should be between 1 and 1000'
  };

  constructor(formBuilder : FormBuilder) {
    this.form = formBuilder.group({
      amount: [50, PacksOpenerComponent.between(0, 1000)],
      type: this.types[0]
    });
  }

  onOpen() {
    console.log(this.form.value);
  }

  static between(min : number, max : number) {
    return (control : FormControl) => {
      const val = _.parseInt(control.value);
      return min < val && val <= max ? null : { rangeError: true };
    };
  }
}
