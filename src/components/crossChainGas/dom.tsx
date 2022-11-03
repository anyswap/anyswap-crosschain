import styled from 'styled-components'

export const FormRowBox = styled.div`
  ${({ theme }) => {
    console.info('theme==========', theme)
    return { backgroundColor: theme.contentBg, color: theme.text2 }
  }};

  width: 100%;
  box-shadow: 0 0.25rem 8px 0 rgb(0 0 0 / 5%);
  border-radius: 1.25rem;
  border: 1px solid rgb (255, 92, 177);
  padding: 1.25rem 2.5rem;
  .head {
    // color: #ffffff;
    font-size: 0.75rem;
  }
  .row {
    display: flex;
  }
  .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
    height: 58px;
    border-radius: 0.75rem;
    background-color: ${({ theme }) => theme.outLinkIconBg};
    border: 0.0625rem solid ${({ theme }) => theme.selectedBorder};
  }
  .ant-select-selection-item {
    color: ${({ theme }) => theme.text2};
    padding-top: 14px !important;
  }
  .ant-select-arrow {
    top: 44.5%;
    color: ${({ theme }) => theme.text2};
  }
  .ant-select-selection-placeholder {
    line-height: 56px !important;
  }
`
export const StyledInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({ error, theme }) => (error ? 'rgb(255, 104, 113)' : theme.textColorBold)};
  width: 100%;
  position: relative;
  font-weight: 500;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.bg1};
  font-size: ${({ fontSize }) => fontSize ?? '44px'};
  text-align: ${({ align }) => align && align};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0px;
  -webkit-appearance: textfield;
  height: 70px;
  background: none;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.inputBorder};
  margin-right: 1.875rem;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    // color: ${({ theme }) => theme.text4};
    color:#DADADA;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
    margin-right: 0;
    height: 50px;
    font-size: 24px;
  `};
  &.error {
    color: ${({ theme }) => theme.red1};
  }
`
export const ArrowDown = styled.div`
  text-align: center;
  font-size: 18px;
  margin: 10px 0;
  span {
    color: ${({ theme }) => theme.text2};
  }
`
