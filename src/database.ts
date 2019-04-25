import Dexie from 'dexie'

class TokenDB extends Dexie {
  public readonly wallets!: Dexie.Table<app.Wallet, number>
  public readonly transfers!: Dexie.Table<app.Transfer, number>
  constructor() {
    super('token_db')
    this.version(1).stores({
      wallets: '++id, &address, name'
    })
    this.version(2).stores({
      // wallets: '++id, &address, name',
      transfers: '++id, &txid, from, to, amount, coin'
    })
  }
}

const DB = new TokenDB()

export default DB
