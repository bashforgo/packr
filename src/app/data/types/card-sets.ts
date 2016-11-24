export type CardSet = 'MSG' | 'OG' | 'TGT' | 'EXPERT1';
export type CardSetLabel = 'MSG' | 'WOG' | 'TGT' | 'CLASSIC';

export namespace CardSet {
  export const MSG : CardSet = 'MSG';
  export const WOG : CardSet = 'OG';
  export const TGT : CardSet = 'TGT';
  export const CLASSIC : CardSet = 'EXPERT1';
  const _long = {
    [MSG]: 'Mean Streets of Gadgetzan',
    [WOG]: 'Whispers of the Old Gods',
    [TGT]: 'The Grand Tournament',
    [CLASSIC]: 'Classic'
  };
  const _labels = {
    [MSG]: <CardSetLabel>'MSG',
    [WOG]: <CardSetLabel>'WOG',
    [TGT]: <CardSetLabel>'TGT',
    [CLASSIC]: <CardSetLabel>'CLASSIC'
  };

  export const long = (s : CardSet) => _long[s];
  export const list = () => _.keys(_long);
  export const label = (s : CardSet) : CardSetLabel => _labels[s];
  export const isMSG = (s : CardSet) => s === MSG;
}
