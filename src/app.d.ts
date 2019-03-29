// tslint:disable-next-line:no-namespace
declare namespace app {
  interface Wallet {
    name: string,
    address: string,
    own: boolean
  }

  interface Token {
    name: string,
    symbol: string,
    icon: string,
    desc: string,
    address: string
  }
}
