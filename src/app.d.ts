// tslint:disable-next-line:no-namespace
declare namespace app {
  interface Wallet {
    name: string,
    address: string,
    own: boolean,
    id?: number
  }

  interface Token {
    id?: number,
    name: string,
    symbol: string,
    icon: string,
    desc: string,
    address: string,
    url?: string,
    decimals: number
  }
}
