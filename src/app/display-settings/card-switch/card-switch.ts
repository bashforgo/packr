import { Component, ChangeDetectionStrategy, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { DisplayCard } from '../../data/types';

@Component({
  selector: 'pr-card-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template
})
export class CardSwitchComponent {
  @Input() value: boolean;
  @Input() onData: DisplayCard;
  @Input() offData: DisplayCard;
  @Output() onClicked = new Subject<boolean>();

  toggle() {
    this.onClicked.next(this.value);
  }

  get currentData() {
    return this.value ? this.onData : this.offData;
  }
}
