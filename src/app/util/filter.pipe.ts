import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'lodash';

@Pipe({
  name: 'prFilter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(value: any[], predicate: (v: any) => boolean): any {
    return filter(value, predicate);
  }
}
