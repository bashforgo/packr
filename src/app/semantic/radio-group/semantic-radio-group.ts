import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pr-semantic-radio-group',
  providers: [
    { provide: NG_VALUE_ACCESSOR, multi: true, useExisting: SemanticRadioGroupComponent }
  ],
  template,
  styles
})
export class SemanticRadioGroupComponent implements ControlValueAccessor {
  @Input()
  options : SemanticRadioGroupOption[];
  selected : any;
  _onChange : (_ : any) => void;
  _onTouched : () => void;

  select(option : any) {
    this.selected = option;
    this._onChange(option);
    this._onTouched();
  }

  writeValue(obj : any) : void {
    this.selected = obj;
  }

  registerOnChange(fn : any) : void {
    this._onChange = fn;
  }

  registerOnTouched(fn : any) : void {
    this._onTouched = fn;
  }
}

export interface SemanticRadioGroupOption {
  label : string;
  value : any;
}
