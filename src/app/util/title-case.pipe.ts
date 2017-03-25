import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'prTitleCase' })
export class TitleCasePipe implements PipeTransform {
  transform(value : string) : string {
    if (_.isEmpty(value)) {
      return value;
    }
    return _.startCase(_.snakeCase(value));
  }
}
