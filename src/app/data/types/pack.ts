import { DisplayCard } from './';

export type Pack = [DisplayCard, DisplayCard, DisplayCard, DisplayCard, DisplayCard];
export type Packs = Pack[];

export type PackWithDust = { pack : Pack, dust : number };
