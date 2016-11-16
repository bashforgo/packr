export enum PackType {
  MSG, WOG, TGT, CLASSIC
}

export namespace PackType {
  export const values : {} = _.pickBy(PackType, _.flow<(s : string) => boolean>(_.toNumber, _.isFinite));

  export function long(type : PackType) : string {
    switch (type) {
      case PackType.MSG:
        return 'Mean Streets of Gadgetzan';
      case PackType.WOG:
        return 'Whispers of the Old Gods';
      case PackType.TGT:
        return 'The Grand Tournament';
      case PackType.CLASSIC:
        return 'Classic';
    }
  }
}
