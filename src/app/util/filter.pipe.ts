import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prFilter',
  pure: false
})

export class FilterPipe implements PipeTransform {
  transform(value: any[], predicate: (v : any) => boolean): any {
    return _.filter(value, predicate);
  }
}
