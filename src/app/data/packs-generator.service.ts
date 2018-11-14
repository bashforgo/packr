import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { chain, map, mapValues } from 'lodash';
import { Observable, ReplaySubject, zip } from 'rxjs';
import { map as rxMap, multicast, refCount, withLatestFrom } from 'rxjs/operators';
import { Generator, MersenneRandomList, RandomList } from '../util/random';
import { CardsAccessor, CardsService, PacksOpeningEvent } from './';
import { PacksOpenerService } from './packs-opener.service';
import { Cost, DisplayCard, JSONCard, Pack, Packs, Rarity, ShortRarity, ShortRarityDictionary } from './types';

type Card = DisplayCard;
type CountByRarity = ShortRarityDictionary<number>;
type CountByCost = { norm: CountByRarity, gold: CountByRarity };
type GeneratorState = {
  packs: Packs,
  cards: CardsAccessor,
  amount: number,
  counts: CountByCost,
  currentPack: DisplayCard[],
  rules: { lgnd: RandomList<JSONCard>, hasLgnd: boolean } | null
};

const goldDrops = <CountByRarity>{ comn: 2.0637, rare: 5.5395, epic: 4.5173, lgnd: 7.3107 };

@Injectable()
export class PacksGeneratorService {
  public events: Observable<Packs>;

  constructor(cs: CardsService, pos: PacksOpenerService, route: ActivatedRoute) {
    this.events = pos.addEvents
      .pipe(
        withLatestFrom(
          zip(pos.events, cs.currentSet)
            .pipe(
              withLatestFrom(route.queryParams),
              rxMap(PacksGeneratorService.reset)
            )
        ),
        rxMap(([added, state]: [number, GeneratorState]) => {
          const { amount, cards, counts, packs, rules, currentPack } = state;
          return state.packs = [...state.packs, ...PacksGeneratorService.packGen({
            amount: amount + added, cards, counts, packs, rules, currentPack
          })];
        }),
        multicast(() => new ReplaySubject<Packs>(1)),
        refCount()
      );
  }

  debug() {
    this.events.subscribe(d => console.log('evs', d));
  }

  static reset([[poe, cards], params]: [[PacksOpeningEvent, CardsAccessor], Params]): GeneratorState {
    return {
      packs: [],
      cards,
      amount: poe.amount,
      counts: {
        norm: { comn: 0, rare: 0, epic: 0, lgnd: 0 },
        gold: { comn: 0, rare: 0, epic: 0, lgnd: 0 }
      },
      currentPack: [],
      rules: params.packRules !== 'old' ? {
        lgnd: cards.rand.lgnd.clone(),
        hasLgnd: false
      } : null
    };
  }

  private static packGen(state: GeneratorState): Packs {
    const { cardGen, rarityGen, isUsingNewRules } = PacksGeneratorService;

    return map(Array(state.amount - state.packs.length).fill(0), () => {
      state.counts.norm = mapValues(state.counts.norm, c => ++c) as ShortRarityDictionary<number>;
      state.counts.gold = mapValues(state.counts.gold, c => ++c) as ShortRarityDictionary<number>;

      if (isUsingNewRules(state) && !state.rules.hasLgnd) {
        state.counts.norm.lgnd += 3;
      }

      const lgnd = () => 1 / (40 - state.counts.norm.lgnd);
      const epic = () => 1 / (10 - state.counts.norm.epic);
      const rare = () => lgnd() + epic() > 1.3 ? 0 : 1.3 - (lgnd() + epic());

      state.currentPack = [];
      state.currentPack.push(cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)));
      state.currentPack.push(cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)));
      state.currentPack.push(cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)));
      state.currentPack.push(cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)));
      state.currentPack.push(cardGen(rarityGen({ comn: 0, rare: rare(), epic: epic(), lgnd: lgnd() }, state)));

      return new RandomList(state.currentPack).shuffle() as Pack;
    });
  }

  private static cardGen([rarity, cost, state]: [ShortRarity, Cost, GeneratorState]): Card {
    const { isUsingNewRules, cardGen } = PacksGeneratorService;
    let detail = state.cards.rand[rarity].peek() as JSONCard;

    if (isUsingNewRules(state)) {
      if (rarity === 'lgnd' && state.rules.lgnd.length) {
        detail = state.rules.lgnd.pop();
      } else {
        const countByNames = chain(state.currentPack)
          .groupBy('name')
          .mapValues((v: DisplayCard[]) => v.length)
          .value();

        const reroll = countByNames[detail.name] >= Rarity.max(rarity);

        if (reroll) {
          return cardGen([rarity, cost, state]);
        }
      }
    }

    return {
      name: detail.name,
      rarity,
      cost,
      cardClass: detail.multiClassGroup || detail.playerClass,
      detail
    } as Card;
  }

  private static rarityGen(chances: CountByRarity, state: GeneratorState): [ShortRarity, Cost, GeneratorState] {
    let rarity: [ShortRarity, Cost];

    if (chances.comn > 0 && state.counts.gold.comn >= 25) {
      rarity = ['comn', 'gold'];
    } else if (state.counts.gold.rare >= 30) {
      rarity = ['rare', 'gold'];
    } else if (state.counts.gold.epic >= 137) {
      rarity = ['epic', 'gold'];
    } else if (state.counts.gold.lgnd >= 310) {
      rarity = ['lgnd', 'gold'];
    } else {
      const list = new MersenneRandomList(
        map(
          chances,
          (v, k) => ({ weight: v, rarity: k })
        ),
        (i) => i.weight
      );
      const chosen = list.peek().rarity as ShortRarity;
      const isGolden: Cost = Generator.random() * 130 < goldDrops[chosen] ? 'gold' : 'norm';
      rarity = [chosen, isGolden];
    }

    const [chosen, isGolden] = rarity;

    state.counts[isGolden][chosen] = 0;

    if (PacksGeneratorService.isUsingNewRules(state) && chosen === 'lgnd') {
      state.rules.hasLgnd = true;
    }

    return [chosen, isGolden, state];
  }

  private static isUsingNewRules(state: GeneratorState) {
    return !!state.rules;
  }
}
