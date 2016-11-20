import { Rarity, CardSet, CardClass, ShortRarity, Cost } from './';

export interface JSONCard {
  name : string;
  rarity : Rarity;
  set : CardSet;
  playerClass? : CardClass;
}

export interface DisplayCard {
  name: string;
  rarity: ShortRarity;
  cost: Cost;
  cardClass: CardClass;
  extra?: boolean;
  detail?: JSONCard;
}
