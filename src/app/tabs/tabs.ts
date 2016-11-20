import { Component } from '@angular/core';
import { PacksGeneratorService, CollectionService } from '../data';

@Component({
  selector: 'pr-tabs',
  template
})
export class TabsComponent {
  private events;
  constructor(public pgs : PacksGeneratorService, cs: CollectionService) {
    // this.events = pgs.events.map(ps => _.map(ps, p => _.map<any, any>(p, c => _.omit(c, 'detail'))));
    this.events = cs.events;
  }
}
