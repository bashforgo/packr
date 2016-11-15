import { Injectable } from '@angular/core';
import { PackType } from './pack-types-enum';

export interface PacksOpeningEvent {
  type : PackType;
  amount : number;
}

@Injectable()
export class PacksOpenerService {

  constructor() { }

  next(data : PacksOpeningEvent) {
    console.log(data);
  }
}
