import { Injectable } from '@angular/core';
import { CardSet, Card, Rarity } from './types';
import { PacksOpenerService } from './packs-opener.service';
import MemoizedFunction = _.MemoizedFunction;
import BiasedRandomList from '../helper/BiasedRandomList';

export type CardsAccessor = {
  all: Card[];
  filtered: _.Dictionary<Card[]>;
  rand: _.Dictionary<BiasedRandomList<Card>>;
}

@Injectable()
export class CardsService {
  filterType : ((type : CardSet) => CardsAccessor) & MemoizedFunction;
  currentSet = this.pos.events
    .map(poe => this.filterType(poe.type));
  private _cards = _.filter(require('./cards.json'), (c : Card) => _.includes(CardSet.list(), c.set));

  constructor(private pos : PacksOpenerService) {
    this.filterType = _.memoize(this._filterType);
  }

  private _filterType(type : CardSet) {
    const all = _.filter<any, Card>(this._cards, { set: type });
    const filtered = _.reduce<string, _.Dictionary<Card[]>>(
      Rarity.list(),
      (res : {}, r : Rarity) => {
        res[Rarity.short(r)] = _.filter(all, { rarity: r });
        return res;
      },
      {}
    );
    const rand = _.mapValues<Card[], BiasedRandomList<Card>>(filtered, f => new BiasedRandomList(f, _.constant(1)));
    return {
      all,
      filtered,
      rand
    };
  }
}
