import { Rarity, CardSet, CardClass, ShortRarity, Cost, PlayerMultiClass } from './';

export interface JSONCard {
  id : string;
  name : string;
  rarity : Rarity;
  set : CardSet;
  cost : number;
  playerClass : CardClass;
  multiClassGroup? : PlayerMultiClass;
}

export interface DisplayCard {
  name: string;
  rarity: ShortRarity;
  cost: Cost;
  cardClass: CardClass;
  detail: JSONCard;
  extra?: boolean;
}
