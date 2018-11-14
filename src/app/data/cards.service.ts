import { Injectable } from '@angular/core';
import { chain, Dictionary, filter, includes, mapValues, matches, memoize, MemoizedFunction, NumericDictionary, overSome, reduce, remove, sortBy, transform } from 'lodash';
import { ReplaySubject } from 'rxjs';
import { map, multicast, refCount } from 'rxjs/operators';
import { RandomList } from '../util/random';
import { PacksOpenerService } from './packs-opener.service';
import { CardClass, CardClassDictionary, CardSet, JSONCard, Rarity, ShortRarity, ShortRarityDictionary } from './types';

type Card = JSONCard;

export type CardsAccessor = {
  all: Dictionary<Card>;
  filtered: {
    byRarity: ShortRarityDictionary<Card[]>,
    byClass: CardClassDictionary<Card[]>
  };
  sorted: Card[],
  rand: ShortRarityDictionary<RandomList<Card>>;
  target: {
    byRarity: ShortRarityDictionary<number>,
    byClass: CardClassDictionary<number>
  };
  type: CardSet;
};

@Injectable()
export class CardsService {
  filterType: ((type: CardSet) => CardsAccessor) & MemoizedFunction;
  currentSet = this.pos.events
    .pipe(
      map(poe => this.filterType(poe.type)),
      multicast(() => new ReplaySubject<CardsAccessor>(1)),
      refCount()
    )
  private _cards: Card[] = filter(require('./cards.json'), (c: Card) => includes(CardSet.list(), c.set));

  constructor(private pos: PacksOpenerService) {
    this.filterType = memoize(this._filterType);
  }

  private _filterType(type: CardSet): CardsAccessor {
    const all = chain(this._cards)
      .filter({ set: type })
      .transform((res, card) => res[card.name] = card, {})
      .value() as Dictionary<Card>;

    const sortByManaThenName = (obj: Dictionary<Card[]> | NumericDictionary<Card[]>): Dictionary<Card[]> => {
      return mapValues(obj, (cards) => sortBy(cards, ['cost', 'name']));
    };

    const filtered = {
      byRarity: sortByManaThenName(transform(
        Rarity.list(),
        (res: {}, r: Rarity) => res[Rarity.short(r)] = filter(all, { rarity: r }),
        {}
      )) as ShortRarityDictionary<Card[]>,
      byClass: sortByManaThenName(transform(
        CardClass.classList(CardSet.isMSG(type)),
        (res: {}, c: CardClass) => res[c] = filter(all, overSome([
          matches({ playerClass: c }),
          matches({ multiClassGroup: c })
        ])),
        {}
      )) as CardClassDictionary<Card[]>
    };
    const sorted = sortByManaThenName({ all }).all;

    const rand = mapValues<Card[], RandomList<Card>>(filtered.byRarity, f => {
      if (CardSet.isWOG(type)) {
        f = [...f];
        remove(f, overSome([
          matches({ name: `C'Thun` }),
          matches({ name: `Beckoner of Evil` })
        ]));
      }
      if (CardSet.isKNC(type)) {
        f = [...f];
        remove(f, { name: 'Marin the Fox' });
      }
      return new RandomList(f);
    }) as ShortRarityDictionary<RandomList<Card>>;

    const target = {
      byRarity: transform(
        Rarity.shortList(),
        (res: {}, rarity: ShortRarity) => res[rarity] = filtered.byRarity[rarity].length * Rarity.max(rarity),
        {}
      ) as ShortRarityDictionary<number>,
      byClass: transform(
        CardClass.classList(CardSet.isMSG(type)),
        (res, klass) => res[klass] = reduce(
          filtered.byClass[klass],
          (res: number, { rarity }) => res + Rarity.max(Rarity.short(rarity)),
          0
        ),
        {}
      ) as CardClassDictionary<number>
    };

    return { all, filtered, sorted, rand, target, type };
  }
}
