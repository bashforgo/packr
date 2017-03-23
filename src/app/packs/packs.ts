import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CollectionService, BestPacksService } from '../data';
import { CardFilterService } from '../display-settings/card-filter/card-filter.service';

@Component({
  selector: 'pr-packs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class PacksComponent {
  constructor(private cs : CollectionService, private bps : BestPacksService, private cfs : CardFilterService) {
  }
}
