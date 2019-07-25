export default {
  navBar: {
    wallets: 'Wallets',
    transfer: 'Transfer'
  },
  wallets: {
    title: 'Wallets',
    import: 'Import',
    add: 'Add',
    observe: 'Observe',
    title_add: 'Add Wallet',
    or: 'OR',
    detail: 'Detail',
    transfer: 'Transfer',
    delete: 'Remove',
    copied: 'Copied',
    hide_amount: 'Hide small assets',
    addr_placeholder: 'Start with 0x',
    token: 'Tokens',
    select_wallet: 'Select a wallet',
    remove_msg: 'Are you sure to remove this wallet?',
    remove_yes: 'Yes',
    remove_no: 'No',
    remove_title: 'Remove Wallet',
    first_time: 'There is no wallet,<br />You need to add a wallet<br />before using.'
  },
  transfer: {
    from: 'From',
    to: 'To',
    amount: 'Amount',
    title: 'Transfer',
    send: 'Send',
    no_wallet: 'There is no wallet, You need to import a wallet first.',
    import_after_tx: 'Import this wallet after the transaction',
    tx_success: 'The request send success',
    // tslint:disable-next-line:max-line-length
    tx_info: 'The Txid: <a href="{path}{txid}" target="_blank">{txid}</a>, check the information.'
  },
  msg: {
    addr_require: 'Address is required',
    addr_format: 'Address format invalid',
    from_require: 'From is required',
    to_format: 'To format invalid',
    to_require: 'To is required',
    amount_require: 'Amount is required',
    amount_invalid: 'Amount is invalid',
    amount_not_enough: 'Insufficient balance',
    // tslint:disable-next-line:max-line-length
    require_connex: `Required Connex environment is not supported. Please download <a href="{url}" target="_blank"> VeChain sync </a> for a frictionless experience.
    `
  }
}
