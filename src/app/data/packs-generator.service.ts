import { Injectable } from '@angular/core';
import { PacksOpenerService } from './packs-opener.service';
import { ShortRarityDictionary, Cost, ShortRarity, DisplayCard } from './types';
import { PacksOpeningEvent, CardsService, CardsAccessor } from './';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';
import { MersenneRandomList, Generator } from '../random';

type Card = DisplayCard;
type Pack = [Card, Card, Card, Card, Card];
type CountByRarity = ShortRarityDictionary<number>;
type CountByCost = { norm : CountByRarity, gold : CountByRarity };
type GeneratorState = {
  packs : Pack[],
  cards : CardsAccessor,
  amount : number,
  counts : CountByCost
}

const goldDrops = <CountByRarity>{ comn: 2.0637, rare: 5.5395, epic: 4.5173, lgnd: 7.3107 };

@Injectable()
export class PacksGeneratorService {
  public events : Observable<Pack[]>;
  private _resetEvent : Observable<GeneratorState>;
  private _addEvent : Observable<{ amount : number }>;
  private _events : Observable<GeneratorState>;

  constructor(private cs : CardsService,
              private pos : PacksOpenerService) {
    this._resetEvent = Observable
      .zip(pos.events, cs.currentSet)
      .map(PacksGeneratorService.reset)
      .multicast(() => new ReplaySubject<GeneratorState>(1))
      .refCount();

    this._addEvent = this._resetEvent
      .switchMap(() => new BehaviorSubject({ amount: 0 }));

    this._events = Observable
      .combineLatest(this._resetEvent, this._addEvent)
      .map(([s, a] : [GeneratorState, any]) => {
        s.amount += a.amount;
        s.packs = [...s.packs, ...PacksGeneratorService.packGen(s)];
        return s;
      });

    this.events = this._events
      .map((s : GeneratorState) => s.packs);
  }

  debug() {
    this._resetEvent.subscribe(d => console.log('reset', d));
    this._events.subscribe(d => console.log('_evs', d));
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

  private static packGen(state : GeneratorState) : Pack[] {
    const { cardGen, rarityGen } = PacksGeneratorService;

    return _.map(Array(state.amount - state.packs.length).fill(0), () => {
      const pack = [
        cardGen(rarityGen({ comn: 99.99, rare: 0.01, epic: 0, lgnd: 0 }, state)),
        cardGen(rarityGen({ comn: 99.8, rare: 0.19, epic: 0.01, lgnd: 0 }, state)),
        cardGen(rarityGen({ comn: 96, rare: 3.95, epic: 0.05, lgnd: 0 }, state)),
        cardGen(rarityGen({ comn: 70, rare: 28, epic: 1.98, lgnd: 0.02 }, state)),
        cardGen(rarityGen({ comn: 0, rare: 80, epic: 16, lgnd: 4 }, state)),
      ] as Pack;

      state.counts.norm = _.mapValues<CountByRarity>(state.counts.norm, c => ++c);
      state.counts.gold = _.mapValues<CountByRarity>(state.counts.gold, c => ++c);

      return pack;
    });
  }

  private static cardGen([rarity, cost, state] : [ShortRarity, Cost, GeneratorState]) : Card {
    const detail = state.cards.rand[rarity].peek();
    return <Card>{
      name: detail.name,
      rarity,
      cost,
      detail
    };
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
    } else if (state.counts.norm.epic >= 10) {
      rarity = ['epic', 'norm'];
    } else if (state.counts.norm.lgnd >= 40) {
      rarity = ['lgnd', 'norm'];
    } else {
      const list = new MersenneRandomList(
        _.map(
          chances,
          (v, k) => ({ weight: v, rarity: k })
        ),
        (i) => i.weight
      );
      const chosen = list.peek().rarity;
      const isGolden : Cost = Generator.random() * 100 < goldDrops[chosen] ? 'gold' : 'norm';
      rarity = [chosen, isGolden];
    }

    const [chosen, isGolden] = rarity;

    state.counts[isGolden][chosen] = 0;

    return [chosen, isGolden, state];
  }
}
