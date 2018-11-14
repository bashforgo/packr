import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SearchParserService } from '../parse/search-parser.service';
import { SearchTerm } from '../parse/search.grammar';

export type Search = { text: string, sts: SearchTerm[] };

@Component({
  selector: 'pr-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class SearchBarComponent {
  form: FormGroup;
  @Output() terms = new Subject<Search>();

  constructor(formBuilder: FormBuilder, sps: SearchParserService) {
    this.form = formBuilder.group({
      search: ''
    });

    this.form.controls.search.valueChanges
      .pipe(map(text => ({ text, sts: sps.parse(text.toLowerCase()) })))
      .subscribe(this.terms);
  }
}
