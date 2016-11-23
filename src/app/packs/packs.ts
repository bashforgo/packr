import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CollectionService, PacksGeneratorService } from '../data';

@Component({
  selector: 'pr-packs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class PacksComponent {
  constructor(private cs : CollectionService, private pgs : PacksGeneratorService) {
  }
}
