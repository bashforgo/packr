import { Component } from '@angular/core';
import { PacksGeneratorService } from '../data';

@Component({
  selector: 'pr-tabs',
  template
})
export class TabsComponent {
  private events;
  constructor(public pgs : PacksGeneratorService) {
    this.events = pgs.events.map(ps => _.map(ps, p => _.map<any, any>(p, c => _.omit(c, 'detail'))));
  }
}
