import { Injectable } from '@angular/core';
import { Parser } from 'nearley';
import { ParserRules, ParserStart } from './search.grammar.ne';
import { SearchTerm } from './search.grammar';

@Injectable()
export class SearchParserService {
  parser = new Parser(ParserRules, ParserStart);

  constructor() {
    this.parser.options.keepHistory = true;
  }

  parse(input : string) : SearchTerm[] {
    this.parser.feed(input);
    const res = this.parser.results[0];
    this.parser.rewind(0);
    return res;
  }
}
