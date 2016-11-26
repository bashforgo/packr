import { Component } from '@angular/core';
import { StatsService, CollectionService } from '../data';

@Component({
  selector: 'pr-stats',
  template
})
export class StatsComponent {
  constructor(private ss : StatsService, private cs : CollectionService) {
  }
}
