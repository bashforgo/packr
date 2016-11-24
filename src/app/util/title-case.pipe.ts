import { InvalidPipeArgumentError } from '@angular/common/src/pipes/invalid_pipe_argument_error';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'prTitleCase' })
export class TitleCasePipe implements PipeTransform {
  transform(value : string) : string {
    if (_.isEmpty(value)) {
      return value;
    }
    if (typeof value !== 'string') {
      throw new InvalidPipeArgumentError(TitleCasePipe, value);
    }
    return _.startCase(_.snakeCase(value));
  }
}
