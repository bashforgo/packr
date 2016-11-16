import { Injectable } from '@angular/core';
import { PacksOpenerService } from './packs-opener.service';

@Injectable()
export class PacksGeneratorService {
  constructor(private pos : PacksOpenerService) {
    this.pos.events.subscribe(d => console.log(d));
  }
}
