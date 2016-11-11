import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SemanticRadioGroupOption } from '../semantic/radio-group/semantic-radio-group';

@Component({
  selector: 'pr-packs-opener',
  template
})
export class PacksOpenerComponent {
  form : FormGroup;
  types = ['WOG', 'TGT', 'CLASSIC'];
  options : SemanticRadioGroupOption[] = _.map(this.types, t => ({ label: t, value: t }));

  constructor(public formBuilder : FormBuilder) {
    this.form = this.formBuilder.group({
      amount: 50,
      type: this.types[0]
    });
  }
}
