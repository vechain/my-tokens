import Dexie from 'dexie'

class TokenDB extends Dexie {
  public readonly wallets!: Dexie.Table<app.Wallet, number>
  constructor() {
    super('token_db')
    this.version(1).stores({
      wallets: '++id, &address, name, own'
    })
  }
}

const DB = new TokenDB()

export default DB
