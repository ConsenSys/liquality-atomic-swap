import { push } from 'connected-react-router'
import { getClient } from '../services/chainClient'
import { actions as transactionActions } from './transactions'

const types = {
  SWITCH_SIDES: 'SWITCH_SIDES'
}

const SWAP_EXPIRATION = 12
const SECRET = 'this is a secret'
const SECRET_HASH = 'EDC64C6523778961FE9BA03AB7D624B27CA1DD5B01E7734CC6C891D50DB04269'

function switchSides () {
  return { type: types.SWITCH_SIDES }
}

function initiateSwap () {
  return async (dispatch, getState) => {
    const {
      assets: { a: { currency, value } },
      wallets: { a: { addresses } },
      counterParty
    } = getState().swap
    const client = getClient(currency)
    const bytecode = await client.generateSwap(
      counterParty[currency],
      addresses[0],
      SECRET_HASH,
      SWAP_EXPIRATION
    )
    const txHash = await client.sendTransaction(addresses[0], null, String(value), bytecode)
    dispatch(transactionActions.setTransaction('ours', 'fund', { hash: txHash }))
    dispatch(push('/link'))
  }
}

const actions = {
  switchSides,
  initiateSwap
}

export { types, actions }
