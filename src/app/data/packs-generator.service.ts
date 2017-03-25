import { Injectable } from '@angular/core';
import { PacksOpenerService } from './packs-opener.service';
import { ShortRarityDictionary, Cost, ShortRarity, DisplayCard, Packs, Pack, JSONCard } from './types';
import { PacksOpeningEvent, CardsService, CardsAccessor } from './';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/observable/zip';
import { MersenneRandomList, Generator } from '../util/random';

type Card = DisplayCard;
type CountByRarity = ShortRarityDictionary<number>;
type CountByCost = { norm : CountByRarity, gold : CountByRarity };
type GeneratorState = {
  packs : Packs,
  cards : CardsAccessor,
  amount : number,
  counts : CountByCost
};

const goldDrops = <CountByRarity>{ comn: 2.0637, rare: 5.5395, epic: 4.5173, lgnd: 7.3107 };

@Injectable()
export class PacksGeneratorService {
  public events : Observable<Packs>;

  constructor(private cs : CardsService,
              private pos : PacksOpenerService) {
    this.events = pos.addEvents
      .withLatestFrom(Observable
        .zip(pos.events, cs.currentSet)
        .map(PacksGeneratorService.reset)
      )
      .map(([added, state] : [number, GeneratorState]) => {
        const {amount, cards, counts, packs} = state;
        return state.packs = [...state.packs, ...PacksGeneratorService.packGen({
          amount: amount + added, cards, counts, packs
        })];
      })
      .multicast(() => new ReplaySubject<Packs>(1))
      .refCount();
  }

  debug() {
    this.events.subscribe(d => console.log('evs', d));
  }

  static reset([poe, cards] : [PacksOpeningEvent, CardsAccessor]) : GeneratorState {
    return {
      packs: [],
      cards,
      amount: poe.amount,
      counts: {
        norm: { comn: 0, rare: 0, epic: 0, lgnd: 0 },
        gold: { comn: 0, rare: 0, epic: 0, lgnd: 0 }
      }
    };
  }

  private static packGen(state : GeneratorState) : Packs {
    const { cardGen, rarityGen } = PacksGeneratorService;

    return _.map(Array(state.amount - state.packs.length).fill(0), () => {
      state.counts.norm = _.mapValues<CountByRarity>(state.counts.norm, c => ++c);
      state.counts.gold = _.mapValues<CountByRarity>(state.counts.gold, c => ++c);

      const lgnd = () => 1 / (40 - state.counts.norm.lgnd);
      const epic = () => 1 / (10 - state.counts.norm.epic);
      const rare = () => lgnd() + epic() > 1.3 ? 0 : 1.3 - (lgnd() + epic());

      const pack = [
        cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)),
        cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)),
        cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)),
        cardGen(rarityGen({ comn: 11.5, rare: 1, epic: epic(), lgnd: lgnd() }, state)),
        cardGen(rarityGen({ comn: 0, rare: rare(), epic: epic(), lgnd: lgnd() }, state)),
      ] as Pack;

      return pack;
    });
  }

  private static cardGen([rarity, cost, state] : [ShortRarity, Cost, GeneratorState]) : Card {
    const detail = state.cards.rand[rarity].peek() as JSONCard;
    return {
      name: detail.name,
      rarity,
      cost,
      cardClass: detail.multiClassGroup || detail.playerClass,
      detail
    } as Card;
  }

  private static rarityGen(chances : CountByRarity, state : GeneratorState) : [ShortRarity, Cost, GeneratorState] {
    let rarity : [ShortRarity, Cost];

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
        _.map(
          chances,
          (v, k) => ({ weight: v, rarity: k })
        ),
        (i) => i.weight
      );
      const chosen = list.peek().rarity as ShortRarity;
      const isGolden : Cost = Generator.random() * 130 < goldDrops[chosen] ? 'gold' : 'norm';
      rarity = [chosen, isGolden];
    }

    const [chosen, isGolden] = rarity;

    state.counts[isGolden][chosen] = 0;

    return [chosen, isGolden, state];
  }
}
