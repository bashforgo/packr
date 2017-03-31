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
    try {
      this.parser.feed(input);
    } catch (e) {
      _.noop();
    }
    const res = this.parser.results[0] || null;
    this.parser.rewind(0);
    return res;
  }
}
