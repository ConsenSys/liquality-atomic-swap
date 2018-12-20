/* global alert */

import { replace } from 'connected-react-router'
import config from '../config'
import { getClient } from '../services/chainClient'
import { actions as transactionActions } from './transactions'
import { actions as secretActions } from './secretparams'
import currencies from '../utils/currencies'
import { sleep } from '../utils/async'
import { getFundExpiration, getClaimExpiration, generateExpiration } from '../utils/expiration'

const types = {
  SWITCH_SIDES: 'SWITCH_SIDES',
  SET_STEP: 'SET_STEP',
  SET_EXPIRATION: 'SET_EXPIRATION',
  SET_LINK: 'SET_LINK',
  SET_IS_VERIFIED: 'SET_IS_VERIFIED'
}

function switchSides () {
  return { type: types.SWITCH_SIDES }
}

function setStep (step) {
  return { type: types.SET_STEP, step }
}

function setExpiration (expiration) {
  return { type: types.SET_EXPIRATION, expiration }
}

function setLink (link) {
  return { type: types.SET_LINK, link }
}

function setIsVerified (isVerified) {
  return { type: types.SET_IS_VERIFIED, isVerified }
}

async function ensureSecret (dispatch, getState) {
  const {
    secretParams,
    assets,
    wallets,
    counterParty,
    isPartyB
  } = getState().swap
  if (!isPartyB && !secretParams.secret) {
    const client = getClient(assets.a.currency)
    const secretMsg = `${assets.a.value}${assets.a.currency}${assets.b.value}${assets.b.currency}${wallets.a.addresses[0]}${counterParty[assets.a.currency].address}${wallets.b.addresses[0]}${counterParty[assets.b.currency].address}`
    const secret = await client.generateSecret(secretMsg)
    dispatch(secretActions.setSecret(secret))
  }
}

async function lockFunds (dispatch, getState) {
  const {
    assets,
    wallets,
    counterParty,
    secretParams,
    expiration,
    isPartyB
  } = getState().swap
  const client = getClient(assets.a.currency)

  let swapExpiration
  if (isPartyB) {
    swapExpiration = getFundExpiration(expiration, 'b').time
  } else {
    swapExpiration = generateExpiration()
    dispatch(setExpiration(swapExpiration))
  }

  const block = await client.getBlockHeight()
  const valueInUnit = currencies[assets.a.currency].currencyToUnit(assets.a.value)
  const initiateSwapParams = [
    valueInUnit,
    counterParty[assets.a.currency].address,
    wallets.a.addresses[0],
    secretParams.secretHash,
    swapExpiration.unix()
  ]
  if (config.debug) { // TODO: enable debugging universally on all CAL functions (chainClient.js)
    console.log('Initiating Swap', initiateSwapParams)
  }
  const txHash = await client.initiateSwap(...initiateSwapParams)
  dispatch(transactionActions.setTransaction('a', 'fund', { hash: txHash, block }))
}

function initiateSwap () {
  return async (dispatch, getState) => {
    await ensureSecret(dispatch, getState)
    await lockFunds(dispatch, getState)
    dispatch(setIsVerified(true))
    dispatch(replace('/backupLink'))
  }
}

function confirmSwap () {
  return async (dispatch, getState) => {
    await lockFunds(dispatch, getState)
    dispatch(waitForSwapClaim())
    dispatch(replace('/backupLink'))
  }
}

async function verifyInitiateSwapTransaction (dispatch, getState) {
  const {
    assets: { b: { currency, value } },
    wallets: { b: { addresses } },
    counterParty,
    secretParams,
    transactions,
    expiration
  } = getState().swap
  const client = getClient(currency)
  const valueInUnit = currencies[currency].currencyToUnit(value)
  while (true) {
    try {
      const swapVerified = await client.verifyInitiateSwapTransaction(transactions.b.fund.hash, valueInUnit, addresses[0], counterParty[currency].address, secretParams.secretHash, expiration.unix())
      if (swapVerified) {
        dispatch(setIsVerified(true))
        break
      }
    } catch (e) {
      console.error(e)
    }
    await sleep(5000)
  }
}

async function findInitiateSwapTransaction (dispatch, getState) {
  const {
    assets: { b: { currency, value } },
    wallets: { b: { addresses } },
    counterParty,
    secretParams,
    expiration
  } = getState().swap
  const client = getClient(currency)
  const valueInUnit = currencies[currency].currencyToUnit(value)
  const swapExpiration = getFundExpiration(expiration, 'b').time
  const initiateTransaction = await client.findInitiateSwapTransaction(valueInUnit, addresses[0], counterParty[currency].address, secretParams.secretHash, swapExpiration.unix())
  dispatch(transactionActions.setTransaction('b', 'fund', initiateTransaction))
}

function waitForSwapConfirmation () {
  return async (dispatch, getState) => {
    dispatch(replace('/waiting'))
    await findInitiateSwapTransaction(dispatch, getState)
  }
}

function waitForSwapClaim () {
  return async (dispatch, getState) => {
    const {
      assets,
      wallets,
      transactions,
      counterParty,
      secretParams,
      expiration,
      isPartyB
    } = getState().swap
    const client = getClient(assets.a.currency)
    const swapExpiration = getFundExpiration(expiration, isPartyB ? 'b' : 'a').time
    const claimTransaction = await client.findClaimSwapTransaction(transactions.a.fund.hash, counterParty[assets.a.currency].address, wallets.a.addresses[0], secretParams.secretHash, swapExpiration.unix())
    dispatch(transactionActions.setTransaction('b', 'claim', claimTransaction))
  }
}

async function unlockFunds (dispatch, getState) {
  const {
    assets,
    wallets,
    counterParty,
    transactions,
    secretParams,
    isPartyB,
    expiration
  } = getState().swap
  const client = getClient(assets.b.currency)
  const block = await client.getBlockHeight()
  const swapExpiration = getClaimExpiration(expiration, isPartyB ? 'b' : 'a').time
  const claimSwapParams = [
    transactions.b.fund.hash,
    wallets.b.addresses[0],
    counterParty[assets.b.currency].address,
    secretParams.secret,
    swapExpiration.unix()
  ]
  if (config.debug) { // TODO: enable debugging universally on all CAL functions (chainClient.js)
    console.log('Claiming Swap', claimSwapParams)
  }
  const txHash = await client.claimSwap(...claimSwapParams)
  dispatch(transactionActions.setTransaction('a', 'claim', { hash: txHash, block }))
}

function redeemSwap () {
  return async (dispatch, getState) => {
    await ensureSecret(dispatch, getState)
    await unlockFunds(dispatch, getState)
  }
}

function refundSwap () {
  return async (dispatch, getState) => {
    const {
      assets,
      wallets,
      counterParty,
      transactions,
      secretParams,
      isPartyB,
      expiration
    } = getState().swap

    const client = getClient(assets.a.currency)
    const swapExpiration = getFundExpiration(expiration, isPartyB ? 'b' : 'a').time
    await client.refundSwap(
      transactions.a.fund.hash,
      counterParty[assets.a.currency].address,
      wallets.a.addresses[0],
      secretParams.secretHash,
      swapExpiration.unix()
    )
  }
}

const actions = {
  switchSides,
  setStep,
  setExpiration,
  setLink,
  setIsVerified,
  initiateSwap,
  confirmSwap,
  findInitiateSwapTransaction,
  verifyInitiateSwapTransaction,
  waitForSwapConfirmation,
  waitForSwapClaim,
  redeemSwap,
  refundSwap
}

export { types, actions }
