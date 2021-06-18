/*eslint-disable*/
import React, {useEffect, useState, useReducer} from 'react'
import { useTranslation } from 'react-i18next'
import { createBrowserHistory } from 'history'
import styled from 'styled-components'
import { Text } from 'rebass'
import { ethers } from 'ethers'
// import { transparentize } from 'polished'
import { useFarmContract, useTokenContract } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks'
import { useWalletModalToggle } from '../../state/application/hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

import { Button } from '../../theme'

import MasterChef from '../../constants/abis/farm/MasterChef.json'
import ERC20_ABI from '../../constants/abis/erc20.json'

import Modal from '../Modal'
import Column from '../Column'
import { PaddedColumn, Separator } from '../SearchModal/styleds'
import { RowBetween } from '../Row'
import { CloseIcon } from '../../theme'

import config from '../../config'
import {fromWei, formatWeb3Str, toWei} from '../../utils/tools/tools'

import TokenLogo from '../TokenLogo'

// import {getPrice} from '../../utils/axios'
import {getAllToken} from '../../utils/bridge/getBaseInfo'

import {getBaseInfo} from './common'

getBaseInfo([], '137', '0xB0A3dA261BAD3Df3f3cc3a4A337e7e81f6407c49', '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249', 41143, 2.3).then((res:any) => {
  console.log(res)
})

const InputRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: 0.25rem 0rem 0.75rem;
  width:100%;
`

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;

  button {
    max-width: 20rem;
  }
  &.pd0 {
    padding: 0
  }
`
const Input = styled.input`
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  height: 70px;
  background-color: transparent;
  border-bottom: 0.0625rem solid ${({theme}) => theme.inputBorder};

  color: ${({ theme }) => theme.textColorBold};
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Manrope';
  font-size: 44px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: -0.0625rem;
  padding: 8px 0.75rem;
  margin-right: 1.875rem;
  ::placeholder {
    color: ${({ theme }) => theme.placeholderGray};
  }
  &.small {
    font-size: 24px;
    margin-right: 0rem;
  }
  @media screen and (max-width: 960px) {
    font-size: 32px;
  }
`

const TokenLogo1 = styled(TokenLogo)`
background:none;
`

const Button1 = styled(Button)`
  ${({theme}) => theme.flexC};
  background: ${({ theme }) => theme.primary1};
  white-space:nowrap;
  :disabled {
    opacity: 0.3;
  }
`

const ComineSoon = styled.div`
  ${({theme}) => theme.flexC}
  width: 200px;
  font-family: 'Manrope';
  font-size: 0.75rem;
  color: #96989e;
  height: 45px;
  padding: 0 8px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.modalBG};
  white-space: nowrap;
`

const FarmListBox = styled.div`
  ${({ theme }) => theme.flexSC};
  width: 100%;
  flex-wrap:wrap;
`

const FarmList = styled.div`
  ${({ theme }) => theme.flexC};
  width: 33.33%;
  padding: 0 10px;
  margin-bottom: 20px;
  @media screen and (min-width: 761px) and (max-width: 1140px) {
    width: 50%;
  }
  @media screen and (max-width: 760px) {
    width: 100%;
  }
`
const FarmListCont = styled.div`
  width:100%;
  // height: 260px;
  background: ${({ theme }) => theme.contentBg};
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  display:block;
  border-radius: 10px;
  padding: 40px 10px;
  position:relative;
`

const MulLabel = styled.div`
  min-width:40px;
  padding: 3px 5px;
  border-radius: 10px;
  position:absolute;
  top:20px;
  left: 20px;
  background: ${({ theme }) => theme.primary1};
  color:#fff;
  font-size:16px;
  text-align:center;
`

const DoubleLogo = styled.div`
  ${({ theme }) => theme.flexC};
  width: 100%;
  position:relaitve;
  margin-top: 30px;
  .logo {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    // background:#fff;
    img {
      height: 100%;
      display:block;
    }
  }
  .right {
    // margin-left: -15px;
    z-index: 0;
  }
  .addIcon {
    font-size: 40px;
    margin: 0 10px;
  }
  .left {
    z-index: 1;
  }
`

const FarmInfo = styled.div`
  width:100%;
  padding: 10px;
  font-size: 12px;
  margin: 30px 0;
  .item {
    ${({ theme }) => theme.flexBC};
    width: 100%;
    margin: 10px 0;
    font-size: 16px;
    .left {
      color:#969DAC;
    }
    .right {
      color:${({ theme }) => theme.textColor};
    }
  }
`
const StakingBox = styled.div`
  width:100%;
`

const StakingList = styled.ul`
  ${({ theme }) => theme.flexC};
  list-style:none;
  padding:0!important;

  .item {
    ${({ theme }) => theme.flexC};
    flex-wrap:wrap;
    width:100%;
    max-width: 320px;
    background: ${({ theme }) => theme.contentBg};
    box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
    margin: 15px 15px 20px;
    padding: 25px 15px 40px;
    border-radius: 10px;

    .pic {
      ${({ theme }) => theme.flexC};
      width:70px;
      height:70px;
      // padding:15px;
      // background:#fff;
      border-radius:100%;
      margin:auth;
      margin-top:30px;
      img {
        display:block;
        width:100%;
      }
    }
    .info {
      width:100%;
      text-align:center;
      margin:30px 0;
      h3 {
        color: ${({ theme }) => theme.textColorBold};
        font-size:16px;
        margin:0;
      }
      p {
        color: #969DAC;
        font-size:14px;
        margin-bottom:0;
      }
    }
    .btn {
      ${({ theme }) => theme.flexC};
      width:100%;
    }
  }
  .green {
    color: #2ead65;
  }
  @media screen and (max-width: 960px) {
    flex-wrap:wrap;
  }
`

const AddBox = styled(Button)`
  ${({ theme }) => theme.flexC};
  width: 45px;
  min-width: 45px;
  height:45px;
  border: solid 0.5px ${({ theme }) => theme.tipBorder};
  box-shadow: 0 0.25rem 8px 0 ${({ theme }) => theme.shadow2};
  background: ${({theme}) => theme.tipBg};
  border-radius: 9px;
  margin-left:15px;
  cursor:pointer;
  padding:0;
  &:hover, &:focus{
    border: solid 0.5px ${({ theme }) => theme.tipBorder};
    box-shadow: 0 0.25rem 8px 0 ${({ theme }) => theme.shadow2};
    background: ${({theme}) => theme.tipBg};
  }
`

const StakingModalBox = styled.div`
  ${({ theme }) => theme.flexC}
  width:100%;
  padding: 25px 15px 30px;
  flex-wrap:wrap;
`
const MaxBox = styled.div`
  ${({ theme }) => theme.flexC};
  width:60px;
  height:50px;
  margin-left:15px;
  border-radius:10px;
  cursor:pointer;
  background:${({ theme }) => theme.tipBg};
`
const AmountView = styled.div`
  width:100%;
  padding:10px 25px;
  font-size:14px;
  color:${({ theme }) => theme.textColor};
  margin-bottom:20px;
`

const StakingLi = styled.li`
  width: 320px;
  ${({ theme }) => theme.flexSC};
  // flex-wrap:wrap;
  background: ${({ theme }) => theme.contentBg};
  box-shadow: 0.4375rem 0.125rem 1.625rem 0 rgba(0, 0, 0, 0.06);
  margin: 20px 15px 0;
  padding: 25px 15px 25px;
  border-radius: 10px;
  .title {
    width:100%;
    margin:0;
    font-size:14px;
    color: ${({ theme }) => theme.textColorBold};
  }
  .num {
    width:100%;
    margin:10px 0 0;
    font-size:16px;
    color: ${({ theme }) => theme.textColorBold};
    p {
      margin: 0;
    }
  }
  .content {
    width:100%;
    margin-left:15px;
  }
`

const BackBox = styled.div`
  cursor:pointer;
  display:inline-block;
`

const Web3Fn = require('web3')

function getInitialFarmState () {
  return {
    lpArr: [],
    lpObj: ''
  }
}


function farmStateReducer(state:any, action:any) {
  switch (action.type) {
    case 'UPDATE_LP': {
      const { 
        index,
        lpToken = '',
        allocPoint = '',
        lastRewardBlock = '',
        accRewardPerShare = '',
        pendingReward = '',
        tokenObj,
        poolBalance,
        lpBalance
      } = action
      const { lpArr } = state
      let obj = {}
      if (lpArr[index]) {
        obj = {
          index: index ? index : (lpArr[index].index ? lpArr[index].index : 0),
          lpToken: lpToken ? lpToken : (lpArr[index].lpToken ? lpArr[index].lpToken : ''),
          allocPoint: allocPoint ? allocPoint : (lpArr[index].allocPoint ? lpArr[index].allocPoint : ''),
          lastRewardBlock: lastRewardBlock ? lastRewardBlock : (lpArr[index].lastRewardBlock ? lpArr[index].lastRewardBlock : ''),
          accRewardPerShare: accRewardPerShare ? accRewardPerShare : (lpArr[index].accRewardPerShare ? lpArr[index].accRewardPerShare : ''),
          pendingReward: pendingReward ? pendingReward : (lpArr[index].pendingReward ? lpArr[index].pendingReward : ''),
          tokenObj: tokenObj ? tokenObj : (lpArr[index].tokenObj ? lpArr[index].tokenObj : ''),
          poolBalance: poolBalance ? poolBalance : (lpArr[index].poolBalance ? lpArr[index].poolBalance : ''),
          lpBalance: lpBalance ? lpBalance : (lpArr[index].lpBalance ? lpArr[index].lpBalance : ''),
        }
      } else {
        obj = {
          index: index ? index : '',
          lpToken: lpToken ? lpToken : '',
          allocPoint: allocPoint ? allocPoint : '',
          lastRewardBlock: lastRewardBlock ? lastRewardBlock : '',
          accRewardPerShare: accRewardPerShare ? accRewardPerShare : '',
          pendingReward: pendingReward ? pendingReward : '',
          tokenObj: tokenObj ? tokenObj : '',
          poolBalance: poolBalance ? poolBalance : '',
          lpBalance: lpBalance ? lpBalance : '',
        }
      }
      lpArr[index] = obj
      let lpObj:any = {}
      for (let exObj of lpArr) {
        lpObj[exObj.lpToken] = exObj
      }
      return {
        ...state,
        lpArr: lpArr,
        lpObj: lpObj
      }
    }
    default: { //UPDATE_MINTINFOTYPE
      return getInitialFarmState()
    }
  }
}

// const BASEMARKET = 100
let onlyOne = 0

interface FarmProps {
  initialTrade?:any,
  FARMTOKEN?:any,
  FARMURL?:any,
  initPairs?:any,
  poolCoin?:any,
  CHAINID?:any,
  blockNumber?:any,
  BASEMARKET?:any,
  price?:any,
}

export default function Farming ({
  initialTrade,
  FARMTOKEN,
  FARMURL,
  initPairs = [],
  poolCoin,
  CHAINID,
  blockNumber = 28800,
  BASEMARKET = 100,
  price
}: FarmProps) {
  
  const { account, chainId } = useActiveWeb3React()
  // account = '0x12139f3afa1C93303e1EfE3Df142039CC05C6c58'
  const { t } = useTranslation()
  const [isDark] = useDarkModeManager()
  const toggleWalletModal = useWalletModalToggle()
  const addTransaction = useTransactionAdder()
  

  const history = createBrowserHistory()
  // history.push(window.location.pathname + '')

  const [farmState, dispatchFarmState] = useReducer( farmStateReducer, {}, getInitialFarmState )
  const {
    lpArr,
    lpObj
  } = farmState
  
  let web3Fn = new Web3Fn(new Web3Fn.providers.HttpProvider(config.getCurChainInfo(CHAINID).nodeRpc))
  function formatNum (str:any) {
    // console.log(str)
    // console.log(web3Fn.utils.hexToNumberString(str))
    return web3Fn.utils.hexToNumberString(str)
  }

  const [BlockReward, setBlockReward] = useState<any>()
  
  const [stakingType, setStakingType] = useState<any>()
  const [stakingModal, setStakingModal] = useState<any>(false)
  const [stakeAmount, setStakeAmount] = useState<any>()
  const [stakeDisabled, setStakeDisabled] = useState<any>(true)

  const [exchangeAddress, setExchangeAddress] = useState<any>('')
  // console.log(exchangeAddress)

  const [unlocking, setUnlocking] = useState<any>(false)
  const [approveAmount, setApproveAmount] = useState<any>()
  const [balance, setBalance] = useState<any>()
  const [userInfo, setUserInfo] = useState<any>()

  const [HarvestDisabled, setHarvestDisabled] = useState<any>(true)
  const [WithdrawDisabled, setWithdrawDisabled] = useState<any>(true)
  const [DepositDisabled, setDepositDisabled] = useState<any>(true)

  const [TotalPoint, setTotalPoint] = useState<any>()

  const [BtnDelayDisabled, setBtnDelayDisabled] = useState<any>(0)

  // const [BasePeice, setBasePeice] = useState<any>()

  const [InterverTime, setInterverTime] = useState<any>(0)
  // const [CYCMarket, setCYCMarket] = useState<any>()

  const web3Contract = new web3Fn.eth.Contract(MasterChef, FARMTOKEN)
  const web3ErcContract = new web3Fn.eth.Contract(ERC20_ABI)

  const MMContract = useFarmContract(FARMTOKEN)

  const MMErcContract = useTokenContract(exchangeAddress)

  const dec = lpObj && exchangeAddress && lpObj[exchangeAddress] ? lpObj[exchangeAddress]?.tokenObj?.decimals : ''

  // useEffect(() => {
  //   getPrice(config.getCurChainInfo(CHAINID).symbol).then((res:any) => {
  //     // console.log(res)
  //     setBasePeice(res)
  //   })
  // }, [CHAINID])

  useEffect(() => {
    let pr = lpObj && lpObj[exchangeAddress] && lpObj[exchangeAddress].pendingReward ? lpObj[exchangeAddress].pendingReward : ''
    // console.log(pr)
    // console.log(BtnDelayDisabled)
    if (approveAmount && Number(approveAmount) && account && Number(CHAINID) === Number(chainId) && exchangeAddress) {
      if (pr && Number(pr) > 0 && BtnDelayDisabled !== 2) {
        setHarvestDisabled(false)
      } else {
        setHarvestDisabled(true)
      }

      if (balance && Number(balance) > 0 && BtnDelayDisabled !== 1) {
        setDepositDisabled(false)
      } else {
        setDepositDisabled(true)
      }
      
      if (userInfo && Number(userInfo) > 0 && BtnDelayDisabled !== 2) {
        setWithdrawDisabled(false)
      } else {
        setWithdrawDisabled(true)
      }
    } else {
      setHarvestDisabled(true)
      setDepositDisabled(true)
      setWithdrawDisabled(true)
    }
  }, [approveAmount, balance, userInfo, account, BtnDelayDisabled, lpObj, exchangeAddress, CHAINID, chainId])

  useEffect(() => {
    let status = true
    // console.log('stakeAmount')
    // console.log(stakeAmount)
    if (stakeAmount && !isNaN(stakeAmount) && Number(stakeAmount) > 0 && !BtnDelayDisabled) {
      
      const dec = lpObj && lpObj[exchangeAddress] ? lpObj[exchangeAddress]?.tokenObj?.decimals : ''
      const amount = stakeAmount
      const value = fromWei(balance, dec, dec)
      const ui = fromWei(userInfo, dec, dec)
      if (stakingType === 'deposit') {
        if (!value || Number(value) < Number(amount)) {
          status = true
        } else {
          status = false
        }
      } else {
        if (!ui || Number(ui) < Number(amount)) {
          status = true
        } else {
          status = false
        }
      }
    } else {
      if (Number(stakeAmount) !== 0) {
        setStakeAmount('')
      }
    }
    
    setStakeDisabled(status)
  }, [stakingType, balance, stakeAmount, BtnDelayDisabled, lpObj, exchangeAddress, userInfo])


  
  function getAllTotalSupply () {
    const batch = new web3Fn.BatchRequest()
    // console.log(lpArr)
    // console.log(lpObj)
    for (let i = 0,len = lpArr.length; i < len; i++) {
      let obj = lpArr[i]

      web3ErcContract.options.address = obj.lpToken
      const blData = web3ErcContract.methods.balanceOf(FARMTOKEN).encodeABI()
      batch.add(web3Fn.eth.call.request({data: blData, to: obj.lpToken}, 'latest', (err:any, res:any) => {
        if (!err) {
          const results = formatWeb3Str(res)
          // console.log(results)
          // console.log(formatNum(results[0]))
          dispatchFarmState({
            type: 'UPDATE_LP',
            index: i,
            lpBalance: formatNum(results[0])
          })
        } else {
          dispatchFarmState({
            type: 'UPDATE_LP',
            index: i,
            lpBalance: ''
          })
        }
      }))
      if (account) {
        web3ErcContract.options.address = obj.lpToken
        const pblData = web3ErcContract.methods.balanceOf(account).encodeABI()
        batch.add(web3Fn.eth.call.request({data: pblData, to: obj.lpToken}, 'latest', (err:any, bl:any) => {
          if (!err) {
            // console.log(formatCellData(bl, 66).toString())
            const results = formatWeb3Str(bl)
            // console.log(results)
            // console.log(formatNum(results[0]))
            dispatchFarmState({
              type: 'UPDATE_LP',
              index: i,
              poolBalance: formatNum(results[0])
            })
          } else {
            // console.log(err)
            dispatchFarmState({
              type: 'UPDATE_LP',
              index: i,
              poolBalance: ''
            })
          }
        }))
      }
    }
    batch.execute()
  }

  function getTokenList(num:number, tokenlist:any) {
    const batch = new web3Fn.BatchRequest()
    let arr:any = []
    let totalPoint = 0
    for (let i = 0; i < num; i++) {
      arr.push({
        lpToken: '',
        allocPoint: '',
        lastRewardBlock: '',
        accRewardPerShare: '',
      })
      const plData = web3Contract.methods.poolInfo(i).encodeABI()
      batch.add(web3Fn.eth.call.request({data: plData, to: FARMTOKEN}, 'latest', (err:any, pl:any) => {
        if (!err) {
          const results:any = formatWeb3Str(pl)
          let exAddr = results[0].replace('0x000000000000000000000000', '0x')
          let curPoint = formatNum(results[1])
          let trade = tokenlist && tokenlist[exAddr] && tokenlist[exAddr]?.list?.underlying?.symbol ? (tokenlist[exAddr]?.list?.underlying?.symbol + '-' + config.getCurChainInfo(CHAINID).symbol) : ''
          if (initialTrade && initialTrade === trade && !onlyOne) {
            onlyOne++
            setExchangeAddress(exAddr)
          }
          const obj = {
            type: 'UPDATE_LP',
            index: i,
            lpToken: exAddr,
            allocPoint: curPoint,
            lastRewardBlock: formatNum(results[2]),
            accRewardPerShare: formatNum(results[3]),
            tokenObj: tokenlist[exAddr].list,
          }
          // console.log(obj)
          dispatchFarmState(obj)
          totalPoint += Number(curPoint)
        } else {
          dispatchFarmState({
            type: 'UPDATE_LP',
            index: i,
            lpToken: '',
            allocPoint: '',
            lastRewardBlock: '',
            accRewardPerShare: '',
          })
        }
        if (i === (num - 1)) {
          getAllTotalSupply()
          setTotalPoint(totalPoint)
          
        }
      }))
      if (account && Number(CHAINID) === Number(chainId)) {
        const prData = web3Contract.methods.pendingReward(i, account).encodeABI()
        batch.add(web3Fn.eth.call.request({data: prData, to: FARMTOKEN}, 'latest', (err:any, reward:any) => {
          if (!err) {
            // console.log(formatCellData(reward, 66).toString())
            const results:any = formatWeb3Str(reward)
            // console.log(formatNum(results[0]))
            dispatchFarmState({
              type: 'UPDATE_LP',
              index: i,
              pendingReward: formatNum(results[0])
            })
          } else {
            dispatchFarmState({
              type: 'UPDATE_LP',
              index: i,
              pendingReward: ''
            })
          }
        }))
      }
    }
    batch.execute()
  }

  function getBaseInfo (tokenlist:any) {
    const batch = new web3Fn.BatchRequest()
    // console.log(12)
    const plData = web3Contract.methods.poolLength().encodeABI()

    batch.add(web3Fn.eth.call.request({data: plData, to: FARMTOKEN}, 'latest', (err:any, pl:any) => {
      if (!err) {
        // console.log(formatNum(pl))
        getTokenList(formatNum(pl), tokenlist)
      }
    }))
    const rpbData = web3Contract.methods.rewardPerBlock().encodeABI()
    batch.add(web3Fn.eth.call.request({data: rpbData, to: FARMTOKEN}, 'latest', (err:any, res:any) => {
      if (!err && res) {
        // console.log(res)
        setBlockReward(formatNum(res))
      }
    }))

    batch.execute()
  }

  function getStakingInfo () {
    const curLpToken = exchangeAddress
    // console.log(lpObj)
    if (account && curLpToken && lpObj && lpObj[curLpToken]) {
      // console.log(123)
      const batch = new web3Fn.BatchRequest()
      // console.log(exchangeAddress)
      web3ErcContract.options.address = curLpToken
      const blData = web3ErcContract.methods.balanceOf(account).encodeABI()
      batch.add(web3Fn.eth.call.request({data: blData, to: curLpToken}, 'latest', (err:any, balance:any) => {
        if (!err) {
          // console.log('balance')
          // console.log(balance)
          // console.log(formatNum(balance))
          setBalance(formatNum(balance))
        }
      }))

      web3ErcContract.options.address = FARMTOKEN
      const alData = web3ErcContract.methods.allowance(account, FARMTOKEN).encodeABI()
      batch.add(web3Fn.eth.call.request({data: alData, to: curLpToken}, 'latest', (err:any, allowance:any) => {
        if (!err) {
          // console.log('allowance')
          // console.log(formatNum(allowance))
          setApproveAmount(formatNum(allowance))
          if (Number(formatNum(allowance).toString()) > 0) {
            setUnlocking(false)
          }
        }
      }))

      const uiData = web3Contract.methods.userInfo(lpObj[curLpToken].index, account).encodeABI()
      batch.add(web3Fn.eth.call.request({data: uiData, to: FARMTOKEN}, 'latest', (err:any, userInfo:any) => {
        if (!err) {
          const results:any = formatWeb3Str(userInfo)
          // console.log('userInfo')
          // console.log(userInfo)
          setUserInfo(formatNum(results[0]))
        }
      }))
      batch.execute()
    }
  }

  useEffect(() => {

    getStakingInfo()
  }, [InterverTime])
  useEffect(() => {
    if (!approveAmount) {
      getStakingInfo()
    }
  }, [lpObj])

  useEffect(() => {
    getAllToken(CHAINID).then((res:any) => {
      // console.log(res)
      if (res) {
        getBaseInfo(res)
      }
      setTimeout(() => {
        setInterverTime(InterverTime + 1)
      }, 1000 * 10)
    })
    // setBasePeice('')
    // setInterverTime('')
    // setCYCMarket('')
  }, [CHAINID, InterverTime])

  function backInit () {
    setStakingModal(false)
    setStakeAmount('')
    setStakingType('')
  }

  function deposit () {
    console.log(MMContract)
    if (isNaN(stakeAmount)) {
      console.log(1)
      setStakeAmount('')
      alert('Param is error!')
      return
    } else if (Number(stakeAmount) <= 0) {
      setStakeAmount('')
      alert('Amount must be greater than 0!')
      return
    } else if (!MMContract) {
      console.log(2)
      setStakeAmount('')
      alert('Param is error!')
      return
    }
    setBtnDelayDisabled(1)
    setTimeout(() => {
      setBtnDelayDisabled(0)
    }, 3000)
    let amount = toWei(Number(stakeAmount).toFixed(dec), dec)
    console.log(amount.toString())
    MMContract.deposit(lpObj[exchangeAddress].index, amount).then((res:any) => {
      console.log(res)
      addTransaction(res, { summary: `Stake ${stakeAmount} ${lpObj[exchangeAddress]?.tokenObj?.symbol}` })
      backInit()
    }).catch((err:any) => {
      console.log(err)
      backInit()
    })
  }

  function withdraw (amount?:any) {
    if (isNaN(stakeAmount) && !amount) {
      setStakeAmount('')
      alert('Param is error!')
      return
    } else if (Number(stakeAmount) <= 0 && amount) {
      setStakeAmount('')
      alert('Amount must be greater than 0!')
      return
    } else if (!MMContract) {
      setStakeAmount('')
      alert('Param is error!')
      return
    }
    setBtnDelayDisabled(2)
    setTimeout(() => {
      setBtnDelayDisabled(0)
    }, 3000)
    
    amount = amount || amount === 0 ? amount : toWei(Number(stakeAmount).toFixed(dec), dec)
    // console.log(amount.toString())
    // console.log(lpObj[exchangeAddress].index)
    MMContract.withdraw(lpObj[exchangeAddress].index, amount.toString()).then((res:any) => {
      console.log(res)
      addTransaction(res, { summary: `Stake ${stakeAmount} ${lpObj[exchangeAddress]?.tokenObj?.symbol}` })
      backInit()
    }).catch((err:any) => {
      console.log(err)
      backInit()
    })
  }

  function approve () {
    if (!MMErcContract) {
      return
    }
    setBtnDelayDisabled(1)
    setTimeout(() => {
      setBtnDelayDisabled(0)
    }, 3000)
    let _userTokenBalance = ethers.constants.MaxUint256.toString()
    // console.log(MMErcContract)
    MMErcContract.approve(FARMTOKEN, _userTokenBalance).then((res:any) => {
      console.log(res)
      addTransaction(res, { summary: `Approve ${lpObj[exchangeAddress]?.tokenObj?.symbol}` })
      setUnlocking(true)
      backInit()
    }).catch((err:any) => {
      console.log(err)
      backInit()
    })
  }

  function onMax () {
    let amount = ''
    if (stakingType === 'deposit') {
      amount = fromWei(balance, dec, dec)
    } else {
      amount = fromWei(userInfo, dec, dec)
    }
    setStakeAmount(amount)
  }

  function getAPY (item:any, allocPoint:any, lpBalance:any) {
    // console.log(price)
    if (
      BlockReward
      && lpBalance
      && TotalPoint
      && allocPoint
      && price
    ) {
      const curdec = item.tokenObj.decimals
      const br = fromWei(BlockReward, 18)
      const lb = fromWei(lpBalance, curdec)
      const baseYear =  (Number(br) * blockNumber * 365 * Number(allocPoint) * price * 100) / (Number(TotalPoint)) / lb
      // console.log(baseYear)
      return baseYear.toFixed(2)
    }
    return '0.00'
  }

  
  // console.log(lpArr)
  function farmsList () {
    if (lpArr.length <= 0 && initPairs.length > 0) {
      return (
        <>
          <FarmListBox>
            {initPairs.map((item:any, index:any) => {
              return <FarmList key={index}>
                <FarmListCont>
                  <DoubleLogo>
                    <div className="logo left">
                      <TokenLogo1 symbol={item} size='100%'/>
                    </div>
                    <div className="addIcon">+</div>
                    <div className="logo right">
                      <TokenLogo1 symbol={config.getCurChainInfo(CHAINID).symbol} size='100%'/>
                    </div>
                    
                  </DoubleLogo>
                  <FarmInfo>
                    <div className="item">
                      <span className="left">Deposit</span>
                      <span className="right">{item} - {config.getCurChainInfo(CHAINID).symbol} LP</span>
                    </div>
                    <div className="item">
                      <span className="left">APY</span>
                      <span className="right">-- %</span>
                    </div>
                    <div className="item">
                      <span className="left">Total Liquidity</span>
                      <span className="right">$ --</span>
                    </div>
                  </FarmInfo>
                  <Flex>
                    {
                      account ? (
                        <ComineSoon><img alt={''} src={require('../../assets/images/icon/schedule.svg')} style={{marginRight: '10px'}} />{t('ComineSoon')}</ComineSoon>
                      ) : (
                        <Button1 onClick={toggleWalletModal}  style={{height: '45px',maxWidth: '200px'}}>
                          {t('ConnectWallet')}
                        </Button1>
                      )
                    }
                  </Flex>
                </FarmListCont>
              </FarmList>
            })}
          </FarmListBox>
        </>
      )
    }
    // console.log(lpArr)
    return (
      <>
        <FarmListBox>
          {
            lpArr.map((item:any, index:any) => {
              return (
                <FarmList key={index}>
                  <FarmListCont>
                    <MulLabel>{item && item.allocPoint ? (Number(item.allocPoint) / BASEMARKET).toFixed(0) : '1'} X</MulLabel>
                    <DoubleLogo>
                      <div className="logo left">
                        <TokenLogo1 symbol={item && item.tokenObj && item.tokenObj.symbol ? item.tokenObj.symbol : ''} size='100%'/>
                      </div>
                      <div className="addIcon">+</div>
                      <div className="logo right">
                        <TokenLogo1 symbol={config.getCurChainInfo(CHAINID).symbol} size='100%'/>
                      </div>
                      
                    </DoubleLogo>
                    <FarmInfo>
                      <div className="item">
                        <span className="left">Deposit</span>
                        <span className="right">{item && item.tokenObj && item.tokenObj.symbol ? item.tokenObj.symbol : ''} LP</span>
                      </div>
                      <div className="item">
                        <span className="left">APY</span>
                        <span className="right">{getAPY(item, item.allocPoint, item.lpBalance)} %</span>
                      </div>
                      <div className="item">
                        <span className="left">Total Liquidity</span>
                        <span className="right">$ {item.lpBalance ? Number(fromWei(item.lpBalance,item.tokenObj.decimals)).toFixed(2) : '0.00'}</span>
                      </div>
                    </FarmInfo>
                    <Flex>
                      {
                        account ? (
                          <Button1 style={{height: '45px', maxWidth: '200px'}} onClick={() => {
                            // console.log(item)
                            // localStorage.setItem(LPTOKEN, item.lpToken)
                            // let coin = item && item.tokenObj && item.tokenObj?.underlying?.symbol ? item.tokenObj?.underlying?.symbol : ''
                            // history.push(FARMURL + '/' + coin + '-' + config.getCurChainInfo(CHAINID).symbol)
                            // history.push(FARMURL + '/' + coin)
                            setExchangeAddress(item.lpToken.toLowerCase())
                          }}>{t('select')}</Button1>
                        ) : (
                          <Button1 onClick={toggleWalletModal}  style={{height: '45px',maxWidth: '200px'}}>
                            {t('ConnectWallet')}
                          </Button1>
                        )
                      }
                    </Flex>
                  </FarmListCont>
                </FarmList>
              )
            })
          }
        </FarmListBox>
      </>
    )
  }

  function getPoolBaseBalance (lpBalance:any) {
    if ( lpBalance ) {
      const t = fromWei(lpBalance, dec)
      if (userInfo) {
        const u = fromWei(userInfo, dec)
        let pecent = Number(u) / Number(t)
        pecent = Number(pecent) * 100
        return {
          ta: t,
          utb: u,
          pecent: pecent
        }
      } else {
        return {
          ta: t,
          utb: '',
          pecent: ''
        }
      }
    }
    return {
      ta: '',
      utb: '',
      pecent: ''
    }
    // userInfo
  }

  function stakingView () {
    let btnView:any = ''
    if (Number(CHAINID) !== Number(chainId)) {
      btnView = <Button1 onClick={() => {
        localStorage.setItem(config.ENV_NODE_CONFIG, config.getCurChainInfo(CHAINID).label)
        history.go(0)
      }}  style={{height: '45px', maxWidth: '200px'}}>
        {t('SwitchTo')} {config.getCurChainInfo(CHAINID).name} {t('mainnet')}
      </Button1>
    } else if (!account) {
      btnView = <Button1 onClick={toggleWalletModal}  style={{height: '45px',maxWidth: '200px'}}>
        {t('ConnectWallet')}
      </Button1>
    } else if (approveAmount && Number(approveAmount)) {
      btnView = <>
        <Button1 style={{height: '45px', maxWidth: '200px'}} disabled={WithdrawDisabled} onClick={() => {
          setStakingType('Unstake')
          setStakingModal(true)
        }}>{t('Unstake')}</Button1>
        <AddBox disabled={DepositDisabled} onClick={() => {
          setStakingType('deposit')
          setStakingModal(true)
        }}>
          {
            isDark ? (
              <img src={require('../../assets/images/icon/add-fff.svg')} alt='' />
            ) : (
              <img src={require('../../assets/images/icon/add.svg')} alt='' />
            )
          }
        </AddBox>
      </>
    } else {
      btnView = <Button1 style={{height: '45px', maxWidth: '200px'}} disabled={BtnDelayDisabled || unlocking} onClick={() => {
        approve()
      }}>{unlocking ? t('pending') : t('unlock')}</Button1>
    }
    let curLpObj = lpObj && lpObj[exchangeAddress] ? lpObj[exchangeAddress] : {}
    
    let prd = curLpObj.pendingReward && Number(curLpObj.pendingReward.toString()) > 0 ? curLpObj.pendingReward : ''
    // console.log(prd)
    prd = prd ? fromWei(prd, 18, 6) : '0.00'

    let pbaObj:any = curLpObj && curLpObj.lpBalance ? getPoolBaseBalance(curLpObj.lpBalance) : ''

    return (
      <>
        <BackBox onClick={() => {
          history.push(FARMURL)
          // localStorage.setItem(LPTOKEN, '')
          setExchangeAddress('')
        }}>
          &lt;Back
        </BackBox>
        <StakingBox>
          <StakingList>
            <StakingLi>
              <TokenLogo1 symbol={curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : ''} size='48px'></TokenLogo1>
              <div className='content'>
                <h2 className='title'>{t('TotalStaking')}</h2>
                <h3 className='num'>
                  <p>{curLpObj.lpBalance ? Number(fromWei(curLpObj.lpBalance, dec, 6)).toFixed(2) : '0.00'} {(curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : '')}</p>
                  {/* <p>{pbaObj.ba ? fromWei(pbaObj.ba, 18, 6) : '0.00'} {config.getCurChainInfo(CHAINID).symbol}</p> */}
                </h3>
              </div>
            </StakingLi>
            <StakingLi>
              {/* <h2 className='title'>Total ANY Supply</h2> */}
              <div className='content'>
                <h2 className='title'>{t('MyStaking')}({pbaObj.pecent ? pbaObj.pecent.toFixed(2) : '0.00'} %)</h2>
                <h3 className='num'>
                  <p>{pbaObj.utb ? pbaObj.utb : '0.00'} {(curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : '')}</p>
                  {/* <p>{pbaObj.ubb ? fromWei(pbaObj.ubb, 18, 6) : '0.00'} {config.getCurChainInfo(CHAINID).symbol}</p> */}
                  {/* {pbaObj.ubb ? 
                (thousandBit(amountFormatter(pbaObj.utb), 2) + '-' + thousandBit(amountFormatter(pbaObj.ubb), 2))
                 : '0.00'} */}
                 </h3>
              </div>
            </StakingLi>
          </StakingList>
        </StakingBox>
        <StakingBox>
          <StakingList>
            <li className='item'>
              <div className='pic'><img src={require('../../assets/images/coin/source/'+ poolCoin + '.svg')} /></div>
              <div className='info'>
                <h3>{prd}</h3>
                <p>
                  {poolCoin} {t('Earned')}
                  <span className='green' style={{marginLeft:'2px'}}>({getAPY(curLpObj, curLpObj.allocPoint, curLpObj.lpBalance)}%)</span>
                </p>
              </div>
              <div className='btn'><Button1 style={{height: '45px', maxWidth: '200px'}} disabled={HarvestDisabled} onClick={() => {
                withdraw(0)
              }}>{t('Harvest')}</Button1></div>
            </li>
            <li className='item'>
              <DoubleLogo>
                <div className="logo left">
                  <TokenLogo1 symbol={curLpObj && curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : ''} size='100%'/>
                </div>
                <div className="addIcon">+</div>
                <div className="logo right">
                  <TokenLogo1 symbol={config.getCurChainInfo(CHAINID).symbol} size='100%'/>
                </div>
                
              </DoubleLogo>
              <div className='info'>
                <h3>{userInfo && Number(userInfo) > 0 && dec? fromWei(userInfo, dec, 6) : '0.00'}</h3>
                <p>{curLpObj.tokenObj && curLpObj.tokenObj.symbol ? curLpObj.tokenObj.symbol : ''} LP {t('Staked')}</p>
              </div>
              <div className='btn'>
                {btnView}
              </div>
            </li>
          </StakingList>
        </StakingBox>
      </>
    )
  }

  

  let amountView = ''
  if (stakingType === 'deposit') {
    amountView = balance ? fromWei(balance, dec, 6) : '0.00'
  } else {
    amountView = userInfo ? fromWei(userInfo, dec, 6) : '0.00'
  }

  return (
    <>
    <Modal isOpen={stakingModal} onDismiss={() => {
      setStakingModal(!stakingModal)
    }} maxHeight={300}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              {t('selectNetwork')}
              {/* <QuestionHelper text={t('tip6')} /> */}
            </Text>
            <CloseIcon onClick={() => {
              setStakingModal(!stakingModal)
            }} />
          </RowBetween>
        </PaddedColumn>
        <Separator />
        <div style={{ flex: '1' }}>
          <StakingModalBox>
            <InputRow>
              <Input type="text" className='small' placeholder="" value={stakeAmount || ''} onChange={e => {
                setStakeAmount(e.target.value)
              }}/>
              <MaxBox onClick={() => {onMax()}}>Max</MaxBox>
            </InputRow>
            <AmountView>
              {amountView} {lpObj && lpObj[exchangeAddress] && lpObj[exchangeAddress]?.tokenObj && lpObj[exchangeAddress]?.tokenObj?.symbol ? lpObj[exchangeAddress].tokenObj.symbol : ''} LP Token
              
            </AmountView>
            <Button1 style={{height: '45px',width: '150px'}} disabled={stakeDisabled} onClick={() => {
              if (stakingType === 'deposit') {
                deposit()
              } else {
                withdraw()
              }
            }}>{t(stakingType)}</Button1>
          </StakingModalBox>
        </div>
        </Column>
      </Modal>
      {exchangeAddress ? stakingView() : farmsList()}
    </>
  )
}

// export default withRouter(BSCFarming)