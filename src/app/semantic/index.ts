import { NgModule } from '@angular/core';
import { SemanticRadioGroupComponent } from './radio-group/semantic-radio-group';
import { CommonModule } from '@angular/common';
import { SemanticInputComponent } from './input/semantic-input';
import { FormsModule } from '@angular/forms';
import { SemanticButtonComponent } from './button/semantic-button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SemanticInputComponent,
    SemanticButtonComponent,
    SemanticRadioGroupComponent
  ],
  exports: [
    SemanticInputComponent,
    SemanticButtonComponent,
    SemanticRadioGroupComponent
  ]
})
export class SemanticModule {
}

export * from './input/semantic-input';
export * from './button/semantic-button';
export * from './radio-group/semantic-radio-group';
