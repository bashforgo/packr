import { NgModule } from '@angular/core';
import { SemanticRadioGroupComponent } from './radio-group/semantic-radio-group';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SemanticRadioGroupComponent
  ],
  exports: [
    SemanticRadioGroupComponent
  ]
})
export class SemanticModule {
}
