import { Rarity, CardSet, PlayerClass, CardClass, ShortRarity, Cost } from './';

export interface JSONCard {
  name : string;
  rarity : Rarity;
  set : CardSet;
  playerClass? : CardClass;
  playerClasses? : PlayerClass[];
}

export interface DisplayCard {
  name: string;
  rarity: ShortRarity;
  cost: Cost;
  detail?: JSONCard;

}
