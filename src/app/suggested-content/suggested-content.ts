import { Component } from '@angular/core';

declare namespace window {
  export let CHITIKA : any;
}

@Component({
  selector: 'pr-suggested-content',
  template,
  styles
})
export class SuggestedContentComponent {
  constructor() {
    if (window.CHITIKA === undefined) {
      window.CHITIKA = {
        'units': [{
          calltype: 'async[2]',
          publisher: 'SpeedoDevo',
          width: 728,
          height: 90,
          sid: 'Chitika Default'
        }, {
          calltype: 'async[2]',
          publisher: 'SpeedoDevo',
          width: 320,
          height: 50,
          sid: 'Chitika Default'
        }]
      };
      require('./chitika');
    }
  }
}
