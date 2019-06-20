const apiHost = 'https://vechain.github.io/token-registry'
export const getTokens = async (net: 'main' | 'test') => {

  const resp = await fetch(`${apiHost}/${net}.json`)
  if (resp.status !== 200) {
    return
  }
  const list = await resp.json()
  return list.map((item: any) => {
    return {
      ...item,
      img: `${apiHost}/assets/${item.icon}`
    }
  })
}
