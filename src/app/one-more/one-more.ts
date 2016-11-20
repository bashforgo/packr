import { Component } from '@angular/core';
import { PacksOpenerService } from '../data';

@Component({
  selector: 'pr-one-more',
  template
})
export class OneMoreComponent {
  constructor(private pos : PacksOpenerService) {
  }

  oneMore() {
    this.pos.oneMore();
  }
}
