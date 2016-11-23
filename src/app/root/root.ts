import { Component, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'pr-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<router-outlet></router-outlet>',
  styles: require('../../index.scss'),
  encapsulation: ViewEncapsulation.None
})
export class RootComponent {}
