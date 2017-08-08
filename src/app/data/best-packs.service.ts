import { Injectable } from '@angular/core';
import { KHeap } from '../util';
import { CollectionService } from './';
import { Dust, PackWithDust } from './types';

@Injectable()
export class BestPacksService {
  public events;

  constructor(cs : CollectionService) {
    this.events = cs.packs
      .map(packs => new KHeap<PackWithDust>(
        5,
        _(packs)
          .map(pack => ({ pack, dust: Dust.value(pack) }))
          .value(),
        (l, r) => KHeap.defaultComparator(r.dust, l.dust)
        ).sorted()
      );
  }
}
