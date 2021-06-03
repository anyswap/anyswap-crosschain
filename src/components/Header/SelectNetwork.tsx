import React, { useState, useEffect } from 'react'
// import { createBrowserHistory } from 'history'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { YellowCard } from '../Card'
import TokenLogo from '../TokenLogo'
import Modal from '../Modal'

import { useActiveWeb3React } from '../../hooks'

import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleNetworkModal } from '../../state/application/hooks'

import { ReactComponent as Close } from '../../assets/images/x.svg'

import config from '../../config'
import {chainInfo} from '../../config/chainConfig'
import {getAllChainIDs} from '../../utils/bridge/getBaseInfo'
import {web3Fn} from '../../utils/tools/web3Utils'

export const WalletLogoBox = styled.div`
  width:100%;
  ${({theme}) => theme.flexBC}
`

export const WalletLogoBox2 = styled.div`
width:100%;
  ${({theme}) => theme.flexSC}
`

export const IconWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-right: 1.25rem;
  border: solid 0.0625rem rgba(0, 0, 0, 0.1);
  background:#fff;
  width:46px;
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
  background-color: ${({ theme }) => theme.contentBg};
`

export const UpperSection = styled.div`
  position: relative;
  width: 100%;
  font-family: 'Manrope';

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
  background-color: ${({ theme }) => theme.contentBg};
  padding: 0px 0.625rem 0.625rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};
`
export const NetWorkList = styled.div`
  width:100%;
  overflow:auth;
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
export const HideSmall = styled.span`
  cursor:pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

export const NetworkCard = styled(YellowCard)`
  border-radius: 12px;
  padding: 8px 12px;
  white-space:nowrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

export function Option (item:any, selectChain:any) {
  // const { chainId } = useActiveWeb3React()
  // console.log(selectChain)
  return (
    <>
      <WalletLogoBox>
        <WalletLogoBox2>
          <IconWrapper>
            {/* <img src={icon} alt={'Icon'} /> */}
            <TokenLogo symbol={item.symbol} size={'46px'}></TokenLogo>
          </IconWrapper>
          <OptionCardLeft>
            <HeaderText>
              {' '}
              {selectChain === item.symbol ? (
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
        </WalletLogoBox2>
      </WalletLogoBox>
    </>
  )
}

export function selectNetwork (chainID:any) {
  return new Promise(resolve => {
    const { ethereum } = window
    const ethereumFN:any = {
      request: '',
      ...ethereum
    }
    if (ethereumFN && ethereumFN.request) {
      ethereumFN.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: web3Fn.utils.toHex(chainID), // A 0x-prefixed hexadecimal string
            chainName: config.getCurChainInfo(chainID).networkName,
            nativeCurrency: {
              name: config.getCurChainInfo(chainID).name,
              symbol: config.getCurChainInfo(chainID).symbol, // 2-6 characters long
              decimals: 18,
            },
            rpcUrls: [config.getCurChainInfo(chainID).nodeRpc],
            blockExplorerUrls: [config.getCurChainInfo(chainID).explorer],
            iconUrls: null // Currently ignored.
          }
        ],
      }).then((res: any) => {
        console.log(res)
        localStorage.setItem(config.ENV_NODE_CONFIG, config.getCurChainInfo(chainID).label)
        // history.go(0)
        resolve({
          msg: 'Success'
        })
      }).catch((err: any) => {
        console.log(err)
        // alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
        resolve({
          msg: 'Error'
        })
      })
    } else {
      // alert(t('changeMetamaskNetwork', {label: config.getCurChainInfo(chainID).networkName}))
      resolve({
        msg: 'Error'
      })
    }
  })
}

export default function SelectNetwork () {
  // const history = createBrowserHistory()
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const networkModalOpen = useModalOpen(ApplicationModal.NETWORK)
  const toggleNetworkModal = useToggleNetworkModal()


  function setMetamaskNetwork (item:any) {
    selectNetwork(item.chainID).then((res:any) => {
      if (res.msg === 'Error') {
        alert(t('changeMetamaskNetwork', {label: item.networkName}))
      }
      toggleNetworkModal()
    })
  }

  function openUrl (item:any) {
    if (!item.isSwitch) {
      return
    }
    setMetamaskNetwork(item)
  }
  const [chainList, setChainList] = useState<Array<any>>([])

  useEffect(() => {
    
    getAllChainIDs(chainId).then((res:any) => {
      // console.log(res)
      setChainList(res)
    })
  }, [chainId])

  

  function changeNetwork () {
    return (
      <Modal
        isOpen={networkModalOpen}
        onDismiss={() => { toggleNetworkModal() }}
        maxHeight={300}
      >
        <Wrapper>
          <UpperSection>
            <CloseIcon onClick={() => {toggleNetworkModal()}}>
              <CloseColor />
            </CloseIcon>
            <HeaderRow>
              <HoverText>{t('SwitchTo')}</HoverText>
            </HeaderRow>
            <ContentWrapper>
              <NetWorkList>
                {
                  chainList && chainList.map((item:any, index:any) => {
                    return (
                      <OptionCardClickable key={index} className={config.getCurChainInfo(chainId).symbol === chainInfo[item].symbol && chainInfo[item].type === config.getCurChainInfo(chainId).type ? 'active' : ''} onClick={() => {openUrl(chainInfo[item])}}>
                        {Option(chainInfo[item], config.getCurChainInfo(chainId).symbol)}
                        {/* <img alt={''} src={AddIcon} /> */}
                      </OptionCardClickable>
                    )
                  })
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
      <HideSmall onClick={() => toggleNetworkModal()}>{<NetworkCard title={config.getCurChainInfo(chainId).networkName}>{config.getCurChainInfo(chainId).networkName}</NetworkCard>}</HideSmall>
    </>
  )
}