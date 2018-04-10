export type CardSet = 'WWD' | 'KNC' | 'KFT' | 'UNGORO' | 'GANGS' | 'OG' | 'TGT' | 'EXPERT1';
export type CardSetLabel = 'WWD' | 'KNC' | 'KFT' | 'JUG' | 'MSG' | 'WOG' | 'TGT' | 'CLASSIC';

export namespace CardSet {
  export const WWD : CardSet = 'WWD';
  export const KNC : CardSet = 'KNC';
  export const KFT : CardSet = 'KFT';
  export const JUG : CardSet = 'UNGORO';
  export const MSG : CardSet = 'GANGS';
  export const WOG : CardSet = 'OG';
  // export const TGT : CardSet = 'TGT';
  export const CLASSIC : CardSet = 'EXPERT1';
  const _long = {
    [WWD]: 'The Witchwood',
    [KNC]: 'Kobolds and Catacombs',
    [KFT]: 'Knights of the Frozen Throne',
    [JUG]: 'Journey to Un\'Goro',
    [MSG]: 'Mean Streets of Gadgetzan',
    [WOG]: 'Whispers of the Old Gods',
    // [TGT]: 'The Grand Tournament',
    [CLASSIC]: 'Classic'
  };
  const _labels = {
    [WWD]: <CardSetLabel>'WWD',
    [KNC]: <CardSetLabel>'KNC',
    [KFT]: <CardSetLabel>'KFT',
    [JUG]: <CardSetLabel>'JUG',
    [MSG]: <CardSetLabel>'MSG',
    [WOG]: <CardSetLabel>'WOG',
    // [TGT]: <CardSetLabel>'TGT',
    [CLASSIC]: <CardSetLabel>'CLASSIC'
  };

  export const long = (s : CardSet) => _long[s];
  export const list = () => _.keys(_long);
  export const label = (s : CardSet) : CardSetLabel => _labels[s];
  export const isKNC = (s : CardSet) => s === KNC;
  export const isMSG = (s : CardSet) => s === MSG;
  export const isWOG = (s : CardSet) => s === WOG;
}
