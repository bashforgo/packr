import { Component } from '@angular/core';
import { PacksGeneratorService, CollectionService, StatsService, BestPacksService } from '../data';
import { Observable } from 'rxjs';

@Component({
  selector: 'pr-tabs',
  template
})
export class TabsComponent {
  private events;

  constructor(pgs : PacksGeneratorService, cs : CollectionService, ss : StatsService, bps : BestPacksService) {
    // this.events = pgs.events.map(ps => _.map(ps, p => _.map<any, any>(p, c => _.omit(c, 'detail'))));
    // this.events = cs.packs.map(ps => _.map(ps, p => _.map<any, any>(p, c => _.omit(c, 'detail'))));
    // this.events = cs.events;
    // this.events = cs.rarityBreakdown;
    // this.events = ss.events;
    // this.events = Observable
    this.events = bps.events; //.map(bps => _.map(bps, (bp : any) => bp.dust));
    //   .combineLatest(
    //     cs.packs.map(ps => _.map(ps, p => _.map<any, any>(p, c => _.omit(c, 'detail')))) as Observable<any>,
    //     cs.events as Observable<any>,
    //     cs.rarityBreakdown as Observable<any>,
    //     ss.events as Observable<any>
    //   )
    //   .map(([ps, coll, rar, stats]) => ({ps, coll, rar, stats}));
  }
}
