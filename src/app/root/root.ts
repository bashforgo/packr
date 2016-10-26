import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pr-root',
  template: '<router-outlet></router-outlet>',
  encapsulation: ViewEncapsulation.None
})
export class RootComponent {}
