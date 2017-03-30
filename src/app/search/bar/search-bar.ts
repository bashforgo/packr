import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { SearchTerm } from '../parse/search.grammar';
import { SearchParserService } from '../parse/search-parser.service';
import { FormBuilder, FormGroup } from '@angular/forms';

export type Search = { text: string, sts: SearchTerm[]};

@Component({
  selector: 'pr-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class SearchBarComponent {
  form : FormGroup;
  @Output() terms = new Subject<Search>();

  constructor(formBuilder : FormBuilder,
              sps : SearchParserService) {
    this.form = formBuilder.group({
      search: ''
    });

    this.form.controls.search.valueChanges
      .map(text => ({ text, sts: sps.parse(text.toLowerCase()) }))
      .subscribe(this.terms);
  }
}
