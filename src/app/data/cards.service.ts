import { Injectable } from '@angular/core';
import { CardSet, JSONCard, Rarity, CostDictionary, ShortRarity, CardClass } from './types';
import { PacksOpenerService } from './packs-opener.service';
import { RandomList } from '../util/random';
import Dictionary = _.Dictionary;

type Card = JSONCard;
export type CardsAccessor = {
  all : Dictionary<Card>;
  filtered : CostDictionary<Card[]>;
  rand : CostDictionary<RandomList<Card>>;
  target : CostDictionary<number>;
  type : CardSet;
}

@Injectable()
export class CardsService {
  filterType : ((type : CardSet) => CardsAccessor) & _.MemoizedFunction;
  currentSet = this.pos.events
    .map(poe => this.filterType(poe.type));
  private _cards = _.filter(require('./cards.json'), (c : Card) => _.includes(CardSet.list(), c.set));

  constructor(private pos : PacksOpenerService) {
    this.filterType = _.memoize(this._filterType);
  }

  private _filterType(type : CardSet) : CardsAccessor {
    const all = _(this._cards)
      .filter({ set: type })
      .transform((res, card) => res[card.name] = card, {})
      .value() as Dictionary<Card>;

    const filtered = _.mapValues(_.assign(_.reduce<string, Dictionary<Card[]>>(
      Rarity.list(),
      (res : {}, r : Rarity) => {
        res[Rarity.short(r)] = _.filter(all, { rarity: r });
        return res;
      },
      {}
      ), _.reduce<string, Dictionary<Card[]>>(
      CardClass.classList(CardSet.isMSG(type)),
      (res : {}, c : CardClass) => {
        res[c] = _.filter(all, { playerClass: c });
        return res;
      },
      {}
      )),
      (cards) => _.sortBy(cards, ['cost', 'name'])
    );

    const rand = _.mapValues<Card[], RandomList<Card>>(filtered, f => new RandomList(f));

    const target = _([...Rarity.shortList(), ...CardClass.classList(CardSet.isMSG(type))])
      .reduce(
        (res : {}, rarityOrClass : ShortRarity | CardClass) => {
          if (Rarity.max(rarityOrClass as ShortRarity)) {
            const rarity = rarityOrClass as ShortRarity;

            res[rarity] = filtered[rarity].length * Rarity.max(rarity);
          } else {
            const klass = rarityOrClass as CardClass;

            res[klass] = _.reduce(
              filtered[klass],
              (res : number, { rarity }) => res + Rarity.max(Rarity.short(rarity)),
              0);
          }
          return res;
        },
        {}
      );

    return { all, filtered, rand, target, type };
  }
}
