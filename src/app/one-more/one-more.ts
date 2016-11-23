import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PacksOpenerService } from '../data';

@Component({
  selector: 'pr-one-more',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class OneMoreComponent {
  constructor(private pos : PacksOpenerService) {
  }

  oneMore() {
    this.pos.oneMore();
  }
}
