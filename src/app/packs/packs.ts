import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CollectionService, BestPacksService } from '../data';

@Component({
  selector: 'pr-packs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class PacksComponent {
  constructor(private cs : CollectionService, private bps : BestPacksService) {
  }
}
