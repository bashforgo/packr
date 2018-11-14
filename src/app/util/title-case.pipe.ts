import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty, snakeCase, startCase } from 'lodash';

@Pipe({ name: 'prTitleCase' })
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    if (isEmpty(value)) {
      return value;
    }
    return startCase(snakeCase(value));
  }
}
