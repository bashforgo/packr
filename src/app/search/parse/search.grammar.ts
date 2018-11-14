import { CardClass, Rarity } from '../../data/types';
export const noop = (d, l, r) => null;
export const join = d => d[0].join('');
export const trim = a => _.filter(a, Boolean);
export const nth = n => d => d[n];
const rarities = _.map(Rarity.list(), s => s.toLowerCase());
const shorts = Rarity.shortList();
const rarityKws = [
  ...rarities,
  ...shorts
];
const classKws = [
  ..._(CardClass.classList(true))
    .map(_.lowerCase)
    .map(s => s.split(' '))
    .flatten()
    .value()
];
const etcKws = [
  'golden', 'extra', 'missing'
];
const binaryKws = [
  ...classKws,
  ...rarityKws,
  ...etcKws
];
const rangedKws = ['owned', 'mana'];

export const predicate = (f, inverse?) => (d, l, r) => f(d[0]) ? (inverse ? r : d[0]) : (inverse ? d[0] : r);

export const toShort = (s: string) => Rarity.short(s.toUpperCase() as Rarity);

const matchesKw = w => kw => kw === w;
export const isEtc = w => _.filter(etcKws, matchesKw(w)).length > 0;
export const isClass = w => _.filter(classKws, matchesKw(w)).length > 0;
export const isRarity = w => _.filter(rarityKws, matchesKw(w)).length > 0;
export const isBinary = w => _.filter(binaryKws, matchesKw(w)).length > 0;
export const isRanged = w => _.filter(rangedKws, matchesKw(w)).length > 0;
export const isNonKeyword = w => {
  return !isBinary(w) && !(_.includes(w, ':') && isRanged(w.split(':')[0]));
};

type SearchTermTypes = 'word' | 'keyword';

export interface SearchTerm {
  type: SearchTermTypes;
  query: string | KeywordQuery;
}

class Word implements SearchTerm {
  readonly type: SearchTermTypes = 'word';

  constructor(public query: string) {
  }
}
export const word = ([d]) => new Word(d);

export type KeywordTypes = 'binary/rarity' | 'binary/class'
  | 'binary/golden' | 'binary/extra' | 'binary/missing'
  | 'ranged/owned' | 'ranged/mana';

interface KeywordQuery {
  type: KeywordTypes;
  data?: string | Range;
}

class Keyword implements SearchTerm {
  readonly type: SearchTermTypes = 'keyword';

  constructor(public query: KeywordQuery) {
  }
}
export const keyword = ([d]) => new Keyword(d);

export const classQuery = ([klass]: string[]) => ({
  type: 'binary/class',
  data: _.find(CardClass.classList(true), c => _.includes(c, klass.toUpperCase()))
} as KeywordQuery);

export const rarityQuery = ([rarity]: string[]) => ({
  type: 'binary/rarity',
  data: Rarity.short(rarity.toUpperCase() as Rarity) || rarity
} as KeywordQuery);

export const etcQuery = ([query]: string[]) => ({
  type: `binary/${query}`
} as KeywordQuery);

export const rangedQuery = ([type, c, data]: [string, string, Range]) => ({
  type: `ranged/${type}`, data
} as KeywordQuery);

export interface Range {
  min: number;
  max: number;
}

type RangedTypes = 'single' | 'up' | 'down' | 'double';

const range = (min: number, max: number) => ({ min, max } as Range);
export const ranged = (type: RangedTypes, a, b) => (args: number[]) => {
  switch (type) {
    case 'single':
      return range(args[a], args[a]);
    case 'up':
      return range(args[a], 99);
    case 'down':
      return range(0, args[a]);
    case 'double':
      return range(args[a], args[b]);
  }
};

export const idId = d => d[0][0];
export const number = d => parseInt(d[0], 10);
export const numberNumber = d => parseInt(d[0] + d[1], 10);
export const concat = d => [d[0], ...d[1]];
