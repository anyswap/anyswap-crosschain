import styled  from "styled-components"
import { transparentize } from 'polished'


import {
  CurrencySelect,
  // Aligner,
  TokenLogoBox,
  // StyledTokenName,
} from '../../components/CurrencySelect/styleds'

import { AutoRow } from '../../components/Row'
import { Input as NumericalInput } from '../../components/NumericalInput'

export const ContentBody = styled.div`
background-color: ${({ theme }) => theme.contentBg};
// background:transparent radial-gradient(closest-side at 50% 50%, #6CA5FF 0%, #524DFB 100%) 0% 0% no-repeat padding-box;
box-shadow: 0 0.25rem 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
// background: rgba(255,255,255,.5);
padding: 30px 20px 60px;
width: 100%;
max-width: 600px;
margin: auto;
border-radius: 20px;
`

export const ContentTitle = styled.h3`
color: ${({ theme }) => theme.textColorBold};
text-align: center;
`
export const SwapContentBox = styled.div`
width: 100%;
margin:50px 0;
`

export const SwapInputLabel = styled.div`
width: 100%;
text-align:right;
.balance {
  font-size:14px;
}
${({ theme }) => theme.mediaWidth.upToMedium`
.balance {
  font-size:12px;
}
`}
`

export const SwapSymbol = styled.div`
width: 100%;
color: ${({ theme }) => theme.textColorBold};
${({ theme }) => theme.mediaWidth.upToMedium`
  font-size:12px;
`}
`

export const SwapInputBox = styled.div`
${({ theme }) => theme.flexSC};
padding: 20px;
width: 100%;
border-radius: 10px;
background: ${({ theme }) => theme.bodyBg};
${({ theme }) => theme.mediaWidth.upToMedium`
  padding: 10px;
`}
`

export const SwapInputContent = styled.div`
${({ theme }) => theme.flexSC};
flex-wrap:wrap;
`

export const CurrencySelect1 = styled(CurrencySelect)`
${({ theme }) => theme.flexC};
width: 100px;
min-width: 100px;
height: 100px;
padding:10px;
margin-left:0;
margin-right:20px;
${({ theme }) => theme.mediaWidth.upToMedium`
  width: 60px;
  min-width: 60px;
  height: 60px;
  padding: 0 0.625rem;
  margin: 0 5px;
`}
`

export const TokenLogoBox1 = styled(TokenLogoBox)`
background:none;
margin:auto;
position: static;
width:100%;
height:100%;
img {
  background: none;
}
`

export const ArrowBox = styled(AutoRow)`
width: 80%;
margin: auto;
height:50px;
`

export const VeNumericalInput = styled(NumericalInput)`
height:56.8px;
border-bottom:none;
${({ theme }) => theme.mediaWidth.upToMedium`
  height:28px;
`}
`