import { NgModule } from '@angular/core';
import { SemanticRadioGroupComponent } from './radio-group/semantic-radio-group';
import { CommonModule } from '@angular/common';
import { SemanticInputComponent } from './input/semantic-input';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SemanticRadioGroupComponent,
    SemanticInputComponent
  ],
  exports: [
    SemanticRadioGroupComponent,
    SemanticInputComponent
  ]
})
export class SemanticModule {
}
