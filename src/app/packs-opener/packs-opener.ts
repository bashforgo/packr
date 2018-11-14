import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, parseInt } from 'lodash';
import { PacksOpenerService } from '../data';
import { CardSet } from '../data/types';
import { SemanticInputErrorLabel, SemanticRadioGroupOption } from '../semantic';

@Component({
  selector: 'pr-packs-opener',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class PacksOpenerComponent {
  form: FormGroup;
  rules: boolean;
  options: SemanticRadioGroupOption[] = map(CardSet.list(), k => ({ label: CardSet.label(k), value: k }));
  errors: SemanticInputErrorLabel = {
    rangeError: 'Should be between 1 and 1000'
  };

  constructor(formBuilder: FormBuilder,
    route: ActivatedRoute,
    private openerService: PacksOpenerService) {
    this.form = formBuilder.group({
      amount: [PacksOpenerService.initial.amount, PacksOpenerComponent.between(0, 1000)],
      type: PacksOpenerService.initial.type
    });
    route.queryParams.subscribe(params => this.rules = params.packRules !== 'old');
  }

  onOpen() {
    this.openerService.next(this.form.value);
  }

  static between(min: number, max: number) {
    return (control: FormControl) => {
      const val = parseInt(control.value, 10);
      return min < val && val <= max ? null : { rangeError: true };
    };
  }
}
