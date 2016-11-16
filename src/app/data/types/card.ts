import { Rarity, CardSet, PlayerClass, CardClass } from './';

export interface Card {
  name : string;
  rarity : Rarity;
  set : CardSet;
  playerClass? : CardClass;
  playerClasses? : PlayerClass[];
}
