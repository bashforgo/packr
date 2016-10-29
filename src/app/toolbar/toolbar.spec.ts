/// <reference path="../../../typings/index.d.ts"/>

import {ToolbarComponent} from './toolbar';
import {TestBed, async} from '@angular/core/testing';

describe('toolbar component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({declarations: [ToolbarComponent]});
    TestBed.compileComponents();
  }));

  it('should render...', () => {
    const fixture = TestBed.createComponent(ToolbarComponent);
    fixture.detectChanges();
  });
});
