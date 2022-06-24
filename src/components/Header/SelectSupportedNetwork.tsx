import React, { useMemo, useState } from 'react'
// import React, { useState, useEffect } from 'react'
// import { createBrowserHistory } from 'history'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Settings, CheckSquare } from 'react-feather'

import { YellowCard } from '../Card'
import TokenLogo from '../TokenLogo'
import Modal from '../Modal'
import Loader from '../Loader'

import { useActiveWeb3React } from '../../hooks'

import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleSupportedNetworkModal } from '../../state/application/hooks'
import { useUserSelectChainId } from '../../state/user/hooks'

import { ReactComponent as Close } from '../../assets/x.svg'

import config from '../../config'
import {chainInfo} from '../../config/chainConfig'

import {setLocalRPC} from '../../config/chainConfig/methods'

import {selectNetwork} from '../../config/tools/methods'

import { useAllMergeBridgeTokenList } from '../../state/lists/hooks'

export const WalletLogoBox = styled.div`
  width:100%;
  ${({theme}) => theme.flexBC}
`

export const WalletLogoBox2 = styled.div`
  width:100%;
  ${({theme}) => theme.flexBC}
  .left {
    ${({theme}) => theme.flexSC};
    width: 100%;
  }
`

export const IconWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  border: solid 0.0625rem rgba(0, 0, 0, 0.1);
  background:#fff;
  width:46px;
  min-width:46px;
  height:46px;
  border-radius:100%;
  & > img,
  span {
    height: 1.625rem;
    width: 1.625rem;
  }
`

export const OptionCardLeft = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  justify-content: center;
  height: 100%;
  width:100%;
`
export const OptionCardLeft1 = styled(OptionCardLeft)`
  display:none;
`
export const HeaderText = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  color: ${({ theme }) => theme.textColor};
  font-size: 1rem;
  font-family: 'Manrope';
  font-weight: 500;
`
export const CircleWrapper = styled.div`
  color: #27AE60;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const GreenCircle = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  justify-content: center;
  align-items: center;

  &:first-child {
    height: 8px;
    width: 8px;
    margin-right: 8px;
    background-color: #27AE60;
    border-radius: 50%;
  }
`

export const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
  // height:100%;
  background-color: ${({ theme }) => theme.contentBg};
`

export const UpperSection = styled.div`
  position: relative;
  width: 100%;
  font-family: 'Manrope';
  overflow:auto;
  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`
export const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.875rem;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`
export const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.chaliceGray};
  }
`
export const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  // position:absolute;
  // top:0;
  // left:0;
  padding: 1.5rem 1.5rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.royalBlue : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`
export const HoverText = styled.div`
  :hover {
    cursor: pointer;
  }
`
export const ContentWrapper = styled.div`
  width: 100%;
  height: ${config.getCurConfigInfo().isOpenBridge ? '85%' : 'auto'};
  overflow:auto;
  background-color: ${({ theme }) => theme.contentBg};
  padding: 0px 0.625rem 0.625rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
  overflow: auto;
`
export const NetWorkList = styled.div`
  width:100%;
  overflow: auto;
`

export const InfoCard = styled.button`
  background-color: ${({ theme }) => theme.contentBg};
  padding: 1rem;
  outline: none;
  border: 0.0625rem solid transparent;
  width: 100% !important;
  cursor:pointer;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.placeholderGray};
  &.active {
    background-color: ${({ theme }) => theme.activeGray};
  }
`

export const OptionCard = styled(InfoCard)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 0.625rem 1rem;
`
export const OptionCardClickable = styled(OptionCard)`
  margin-top: 0;
  &:hover {
    cursor: pointer;
    background: rgba(0,0,0,.1);
  }
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  &:last-child{
    border-bottom:none;
  }
`

export const NetworkCard = styled(YellowCard)`
  ${({ theme }) => theme.flexC};
  border-radius: 12px;
  padding: 8px 12px;
  white-space:nowrap;
  // min-width: 160px;
  color: ${({ theme }) => theme.textColorBold};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const StyledMenuIcon = styled(Settings)`
  height: 20px;
  width: 20px;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const CheckSquareIcon = styled(CheckSquare)`
  height: 20px;
  width: 20px;
  display:none;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const LoaderIcon = styled(Loader)`
  height: 20px;
  width: 20px;
  // display:none;

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const Input = styled.input`
  outline: none;
  border: none;
  flex: 1 1 auto;
  width: 0;
  height: 45px;
  width:100%;
  background-color: transparent;
  border-bottom: 0.0625rem solid ${({theme}) => theme.inputBorder};

  color: ${({ theme }) => theme.textColorBold};
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Manrope';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: -0.0625rem;
  padding: 8px 0.75rem;
  ::placeholder {
    color: ${({ theme }) => theme.placeholderGray};
  }
`

const Web3 = require('web3')

function isConnect (rpc:string) {
  return new Promise(resolve => {
    if (!rpc || rpc.indexOf('https://') !== 0) {
      resolve({
        msg: 'Error',
        error: "Failed to construct 'URL': Invalid URL"
      })
    } else {
      const web3Fn = new Web3(new Web3.providers.HttpProvider(rpc))
      web3Fn.eth.getBlock('latest').then((res:any) => {
        console.log(res)
        resolve({
          msg: 'Success',
          info: res
        })
      }).catch((err:any) => {
        resolve({
          msg: 'Error',
          error: err.toString()
        })
      })
    }
  })
}

export function Option ({
  curChainId,
  selectChainId
}: {
  curChainId:any,
  selectChainId:any
}) {
  const item = config.getCurChainInfo(curChainId)
  const [viewUrl, setViewUrl] = useState<string>(item.nodeRpc)
  const [viewLoading, setViewLoading] = useState<boolean>(false)
  // console.log(viewUrl)
  return (
    <>
      <WalletLogoBox>
        <WalletLogoBox2>
          <div className="left">
            <IconWrapper>
              {/* <img src={icon} alt={'Icon'} /> */}
              <TokenLogo symbol={item?.networkLogo ?? item?.symbol} size={'46px'}></TokenLogo>
            </IconWrapper>
            <OptionCardLeft id={'chain_list_name_' + curChainId}>
              <HeaderText>
                {' '}
                {
                (
                  curChainId
                  && selectChainId
                  && curChainId.toString() === selectChainId.toString()
                ) ? (
                  <CircleWrapper>
                    <GreenCircle>
                      <div />
                    </GreenCircle>
                  </CircleWrapper>
                ) : (
                  ''
                )}
                {item.networkName}
              </HeaderText>
            </OptionCardLeft>
            <OptionCardLeft1 id={'chain_list_url_' + curChainId} onClick={e => e.stopPropagation()}>
              <Input value={viewUrl} id={'chain_list_input_' + curChainId} onChange={(event:any) => {
                // const htmlInput:any = document.getElementById('chain_list_input_' + curChainId)
                // if (htmlInput) {
                //   htmlInput.value = event.target.value
                // }
                setViewUrl(event.target.value)
              }}/>
            </OptionCardLeft1>
          </div>
          {
            item.nodeRpc ? (
              <StyledMenuIcon id={'chain_list_set_' + curChainId} onClick={e => {
                const htmlNameNode = document.getElementById('chain_list_name_' + curChainId)
                const htmlNameNode1 = document.getElementById('chain_list_set_' + curChainId)
                const htmlUrlNode = document.getElementById('chain_list_url_' + curChainId)
                const htmlUrlNode1 = document.getElementById('chain_list_tick_' + curChainId)
                if (htmlNameNode) htmlNameNode.style.display = 'none'
                if (htmlNameNode1) htmlNameNode1.style.display = 'none'
                if (htmlUrlNode) htmlUrlNode.style.display = 'block'
                if (htmlUrlNode1) htmlUrlNode1.style.display = 'block'
                e.stopPropagation()
              }}></StyledMenuIcon>
            ) : ''
          }
          {viewLoading ? <LoaderIcon></LoaderIcon> : (
            <CheckSquareIcon id={'chain_list_tick_' + curChainId} onClick={e => {
              setViewLoading(true)
              const htmlNameNode = document.getElementById('chain_list_name_' + curChainId)
              const htmlNameNode1 = document.getElementById('chain_list_set_' + curChainId)
              const htmlUrlNode = document.getElementById('chain_list_url_' + curChainId)
              const htmlUrlNode1 = document.getElementById('chain_list_tick_' + curChainId)
              isConnect(viewUrl).then((res:any) => {
                setViewLoading(false)
                if (res.msg === 'Success') {
                  if (viewUrl === item.nodeRpc) {
                    if (htmlNameNode) htmlNameNode.style.display = 'block'
                    if (htmlNameNode1) htmlNameNode1.style.display = 'block'
                    if (htmlUrlNode) htmlUrlNode.style.display = 'none'
                    if (htmlUrlNode1) htmlUrlNode1.style.display = 'none'
                  } else {
                    setLocalRPC(curChainId, viewUrl)
                    console.log('>>> go 3')
                    history.go(0)
                  }
                } else {
                  alert(res.error)
                }
              })
              e.stopPropagation()
            }}></CheckSquareIcon>
          )}
        </WalletLogoBox2>
      </WalletLogoBox>
    </>
  )
}

export default function SelectSupportedNetwork () {
  // const history = createBrowserHistory()
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const networkModalOpen = useModalOpen(ApplicationModal.SUPPORTED_NETWORK)
  const toggleNetworkModal = useToggleSupportedNetworkModal()
  const [selectNetworkInfo, setUserSelectNetwork] = useUserSelectChainId()


  function setMetamaskNetwork (item:any) {
    selectNetwork(item.chainID).then((res:any) => {
      // console.log(res)
      setUserSelectNetwork('')
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: item.networkName}))
      }
      toggleNetworkModal()
    })
  }
// console.log(selectNetworkInfo)
  function openUrl (item:any) {
    if (!item.isSwitch) {
      return
    }
    // console.log(selectNetworkInfo)
    if (item?.chainType && item?.chainType !== 'EVM') {
      setUserSelectNetwork({
        chainId: item.chainID,
        label: item?.chainType
      })
      toggleNetworkModal()
    } else {
      setMetamaskNetwork(item)
    }
  }

  const useChainId = useMemo(() => {
    // const hrefPath = window.location.pathname
    // if (selectNetworkInfo && hrefPath.indexOf('/' + selectNetworkInfo?.label?.toLowerCase()) !== -1) {
    if (selectNetworkInfo?.chainId) {
      return selectNetworkInfo?.chainId
    }
    return chainId
  }, [selectNetworkInfo, chainId])

  const allTokensList:any = useAllMergeBridgeTokenList(`mergeTokenList`)

  function changeNetwork () {
    return (
      <Modal
        isOpen={networkModalOpen}
        onDismiss={() => { toggleNetworkModal() }}
        maxHeight={80}
        minHeight={80}
      >
        <Wrapper>
          <UpperSection>
            <CloseIcon onClick={() => {toggleNetworkModal()}}>
              <CloseColor />
            </CloseIcon>
            <HeaderRow>
              <HoverText>{t('SwitchTo')} Supported</HoverText>
            </HeaderRow>
            <ContentWrapper>
              <NetWorkList>
                {
                  Object.keys(allTokensList).map((chainId) => {
                    if (Object.keys(allTokensList[chainId].tokenList).length > 0) {
                      return (
                        <OptionCardClickable key={chainId} className={
                          useChainId?.toString() === chainId?.toString()  ? 'active' : ''} onClick={() => {openUrl(chainInfo[chainId])}}>
                          <Option curChainId={chainId} selectChainId={useChainId}></Option>
                        </OptionCardClickable>
                      )
                    } else return null
                  })
                  /*
                  spportChainArr && spportChainArr.map((item:any, index:any) => {
                    return (
                      <OptionCardClickable key={index} className={
                        useChainId?.toString() === item?.toString()  ? 'active' : ''} onClick={() => {openUrl(chainInfo[item])}}>
                        <Option curChainId={item} selectChainId={useChainId}></Option>
                      </OptionCardClickable>
                    )
                  })
                  */
                }
              </NetWorkList>
            </ContentWrapper>
          </UpperSection>
        </Wrapper>
      </Modal>
    )
  }
  return (
    <>
      {changeNetwork()}
    </>
  )
}