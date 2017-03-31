declare var template: string;
declare var styles: [string];
declare var process: { env: any };

declare module '*.ne' {
  export const ParserRules: any[];
  export const ParserStart: string;
}

declare module 'nearley' {
  const Parser: any;
  export { Parser };
}
