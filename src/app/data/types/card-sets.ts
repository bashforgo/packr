export type CardSet = 'MSG' | 'WOG' | 'TGT' | 'CLASSIC'

class SetsFactory {
  MSG : CardSet = 'MSG';
  WOG : CardSet = 'WOG';
  TGT : CardSet = 'TGT';
  CLASSIC : CardSet = 'CLASSIC';
  private _long = {
    [this.MSG]: 'Mean Streets of Gadgetzan',
    [this.WOG]: 'Whispers of the Old Gods',
    [this.TGT]: 'The Grand Tournament',
    [this.CLASSIC]: 'Classic'
  };

  long(s : CardSet) {
    return this._long[s];
  }

  list() {
    return _.keys(this._long);
  }
}

export const CardSets = new SetsFactory();
