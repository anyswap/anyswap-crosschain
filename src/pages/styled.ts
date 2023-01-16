import styled from 'styled-components'

export const LogoBox = styled.div`
  ${({ theme }) => theme.flexC};
  width: 46px;
  height: 46px;
  object-fit: contain;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.04);
  border: solid 0.5px rgba(0, 0, 0, 0.1);
  border-radius:100%;
  margin: auto;

  img{
    height: 24px;
    width: 24px;
    display:block;
  }
`

export const ConfirmContent = styled.div`
  width: 100%;
`
export const TxnsInfoText = styled.div`
  font-family: 'Manrope';
  font-size: 22px;
  text-align: center;
  color: ${({ theme }) => theme.textColorBold};
  margin-top: 1rem;
`
export const ConfirmText = styled.div`
  width: 100%;
  font-family: 'Manrope';
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
  color: #734be2;
  padding: 0.8rem 0;
  border-top: 0.0625rem solid rgba(0, 0, 0, 0.08);
  margin-top:1.25rem,
  word-break: break-all;
  word-wrap: break-word;
`

export const FlexEC = styled.div`
  ${({ theme }) => theme.flexEC};
`

export const ListBox = styled.div`
  width:100%;
  margin-bottom: 30px;
  .item{
    width: 100%;
    margin-bottom: 10px;
    .label{
      color: ${({ theme }) => theme.text1};
      margin: 0;
    }
    .value {
      color: ${({ theme }) => theme.textColorBold};
      margin: 0;
      word-break: break-all;
      &.flex-bc {
        ${({ theme }) => theme.flexBC};
        flex-wrap:wrap;
      }
      &.flex-sc {
        ${({ theme }) => theme.flexSC};
        flex-wrap:wrap;
      }
    }
  }
`