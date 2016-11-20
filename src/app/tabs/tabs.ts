import { Component } from '@angular/core';
import { PacksGeneratorService, CollectionService, StatsService } from '../data';

@Component({
  selector: 'pr-tabs',
  template
})
export class TabsComponent {
  private events;
  constructor(pgs : PacksGeneratorService, cs: CollectionService, ss : StatsService) {
    // this.events = pgs.events.map(ps => _.map(ps, p => _.map<any, any>(p, c => _.omit(c, 'detail'))));
    // this.events = cs.packs.map(ps => _.map(ps, p => _.map<any, any>(p, c => _.omit(c, 'detail'))));
    // this.events = cs.events;
    this.events = ss.events;
  }
}
