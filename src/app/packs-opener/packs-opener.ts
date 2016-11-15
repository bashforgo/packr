import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SemanticRadioGroupOption } from '../semantic/radio-group/semantic-radio-group';
import { SemanticInputErrorLabel } from '../semantic/input/semantic-input';
import { PackType } from '../data/pack-types-enum';
import { PacksOpenerService } from '../data/packs-opener.service';

@Component({
  selector: 'pr-packs-opener',
  template,
  styles
})
export class PacksOpenerComponent {
  form : FormGroup;
  types = PackType.values;
  options : SemanticRadioGroupOption[] = _.map(this.types, (k, v) => ({ label: v, value: k }));
  errors : SemanticInputErrorLabel = {
    rangeError: 'Should be between 1 and 1000'
  };

  constructor(
    formBuilder : FormBuilder,
    private openerService : PacksOpenerService
  ) {
    this.form = formBuilder.group({
      amount: [50, PacksOpenerComponent.between(0, 1000)],
      type: this.types[PackType[0]]
    });
  }

  onOpen() {
    this.openerService.next(this.form.value);
  }

  static between(min : number, max : number) {
    return (control : FormControl) => {
      const val = _.parseInt(control.value);
      return min < val && val <= max ? null : { rangeError: true };
    };
  }
}
