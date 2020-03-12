export default {
  navBar: {
    wallets: '錢包',
    transfer: '轉賬'
  },
  wallets: {
    title: '錢包',
    import: '導入',
    add: '添加',
    observe: '觀察',
    title_add: '添加錢包',
    or: '或',
    detail: '詳情',
    transfer: '轉賬',
    delete: '移除',
    copied: '已複製',
    hide_amount: '隱藏小額資產',
    addr_placeholder: '地址為0x開頭',
    token: '幣種',
    unknown_wallet: '未知錢包',
    select_wallet: '選擇錢包',
    remove_msg: '是否要移除錢包?',
    remove_yes: '是',
    remove_no: '否',
    remove_title: '移除錢包',
    first_time: '使用前請先添加錢包'
  },
  transfer: {
    from: '轉出地址',
    to: '收款地址',
    amount: '數量',
    title: '轉賬',
    send: '發送',
    no_wallet: '未檢測到錢包，您需要先導入',
    import_after_tx: '交易發出後將錢包導入',
    tx_success: '交易已發送',
    tx_info : '交易哈希為: <a href="{path}{txid}" target="_blank">{txid}</a>,點擊查看詳情'
  },
  msg: {
    addr_require: '地址為必填項',
    addr_format: '地址格式錯誤',
    from_require: '轉出地址未輸入',
    to_format: '轉入地址格式錯誤',
    to_require: '轉入地址未輸入',
    amount_require: '轉出數額未輸入',
    amount_invalid: '轉出數額格式錯誤',
    require_connex: `當前Connex環境不支持程序運行，請下載 <a href="{url}" target="_blank"> VeChain Sync </a> 享受流暢體驗。`
  }
}
