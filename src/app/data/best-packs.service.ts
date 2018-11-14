import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KHeap } from '../util';
import { CollectionService } from './';
import { Dust, PackWithDust } from './types';

@Injectable()
export class BestPacksService {
  public events: Observable<PackWithDust[]>;

  constructor(cs: CollectionService) {
    this.events = cs.packs
      .pipe(map(
        packs => new KHeap<PackWithDust>(
          5,
          _(packs)
            .map(pack => ({ pack, dust: Dust.value(pack) }))
            .value(),
          (l, r) => KHeap.defaultComparator(r.dust, l.dust)
        ).sorted()
      ));
  }
}
