import { Pipe, PipeTransform } from '@angular/core';
import { JSONCard, Rarity, ShortRarity } from '../data/types';
import { Search } from '../search/bar/search-bar';
import { Collection } from '../data';
import { KeywordTypes, Range } from '../search/parse/search.grammar';
import Dictionary = _.Dictionary;

type Card = JSONCard;
type Predicate = (data : (string | Range), card : Card, coll : Collection, keywords : {}[]) => boolean;

@Pipe({
  name: 'prCollectionFilter'
})
export class CollectionFilterPipe implements PipeTransform {
  static predicates : Dictionary<Predicate> = {
    'binary/rarity': (data : ShortRarity, card : Card, coll : Collection, keywords : {}[]) => {
      return data === Rarity.short(card.rarity);
    },
    'binary/golden': (data, card : Card, coll : Collection, keywords : {}[]) => {
      const handled = 'binary/extra' in keywords || 'binary/missing' in keywords || 'ranged/owned' in keywords;
      return handled || _.get(coll, [card.name, 'gold']) > 0;
    },
    'binary/extra': (data, card : Card, coll : Collection, keywords : {}[]) => {
      const count = CollectionFilterPipe.getCount(card, coll, 'binary/golden' in keywords);
      return count > Rarity.max(Rarity.short(card.rarity));
    },
    'binary/missing': (data, card : Card, coll : Collection, keywords : {}[]) => {
      const count = CollectionFilterPipe.getCount(card, coll, 'binary/golden' in keywords);
      return count < Rarity.max(Rarity.short(card.rarity));
    },
    'ranged/owned': (data : Range, card : Card, coll : Collection, keywords : {}[]) => {
      const count = CollectionFilterPipe.getCount(card, coll, 'binary/golden' in keywords);
      return data.min <= count && count <= data.max;
    },
    'ranged/mana': (data : Range, card : Card, coll : Collection, keywords : {}[]) => {
      return data.min <= card.cost && card.cost <= data.max;
    }
  };

  static getCount({ name } : Card, coll : Collection, golden : any) : number {
    let count = 0;
    if (!golden) {
      count += _.get<number>(coll, [name, 'norm'], 0);
    }
    count += _.get<number>(coll, [name, 'gold'], 0);

    return count;
  }

  transform(cards : Card[], collection : Collection, search : Search) {
    if (search.text) {
      const types = _.groupBy(search.sts, 'type');

      if (types.word) {
        const words = _.map(types.word, 'query');

        console.log(`fuzzaldrin(${ words.join(' ') })`);
      }

      if (types.keyword) {
        const groups = _(types.keyword)
          .groupBy('query.type')
          .mapValues((a : {}[]) => _.map(a, 'query.data'))
          .mapValues((a : (string | Range)[], t : KeywordTypes, gs) => {
            return _(a)
              .map((data) => {
                return (card : Card) => CollectionFilterPipe.predicates[t](data, card, collection, gs);
              })
              .overSome()
              .value();
          })
          .values()
          .overEvery()
          .value();

        return _.filter(cards, groups);
      }

      return cards;
    } else {
      return cards;
    }
  }
}
