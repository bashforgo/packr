import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BestPacksService, CollectionService } from '../data';
import { CardFilterService } from '../display-settings/card-filter/card-filter.service';

@Component({
  selector: 'pr-packs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template,
  styles
})
export class PacksComponent {
  constructor(public cs: CollectionService, public bps: BestPacksService, public cfs: CardFilterService) {
  }
}
