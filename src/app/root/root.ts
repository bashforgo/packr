import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pr-root',
  template: '<router-outlet></router-outlet>',
  styles: require('../../index.scss'),
  encapsulation: ViewEncapsulation.None
})
export class RootComponent {}
