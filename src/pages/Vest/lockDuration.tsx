import React, { useEffect, useMemo, useRef, useState } from "react"
// import { useTranslation } from 'react-i18next'
import styled from "styled-components"
import { Clock } from 'react-feather'
import moment from 'moment';
import BigNumber from 'bignumber.js';


import TokenLogo from '../../components/TokenLogo'

import {
  SwapInputBox,
  CurrencySelect1,
  TokenLogoBox1,
  SwapInputContent,
} from './style'

import {
  INIT_TIME
} from './data'

const DateInputBox = styled.div`
  width: 100%;
  height:56.8px;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height:56.8px;
    `
  }
`
const DateInput = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
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
  height:56.8px;
  border-bottom:none;
  background: none;
  // margin-right: 1.875rem;
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  &[type="date" i] {
    // display:none;
    color: ${({ theme }) => theme.textColorBold};
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      visibility: hidden!important;
    }

    ::-webkit-datetime-edit { } /*控制编辑区域的*/

    ::-webkit-datetime-edit-fields-wrapper { } /*控制年月日这个区域的*/

    ::-webkit-datetime-edit-text {  } /*这是控制年月日之间的斜线或短横线的*/

    ::-webkit-datetime-edit-year-field {  } /*控制年文字, 如2013四个字母占据的那片地方*/

    ::-webkit-datetime-edit-month-field {  } /*控制月份*/

    ::-webkit-datetime-edit-day-field { } /*控制具体日子*/
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
`

const DateInput1 = styled.input<{ error?: boolean; fontSize?: string; align?: string }>`
  color: ${({ error, theme }) => (error ? 'rgb(255, 104, 113)' : theme.textColorBold)};
  width: 56.8px;
  position: absolute;
  top:0;right:0;bottom:0;
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
  height:56.8px;
  border-bottom:none;
  background: none;
  opacity: 0;
  // margin-right: 1.875rem;
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  &[type="date" i] {
    // display:none;
    color: ${({ theme }) => theme.textColorBold};
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      visibility: hidden!important;
    }

    ::-webkit-datetime-edit {display:none } /*控制编辑区域的*/

    ::-webkit-datetime-edit-fields-wrapper { } /*控制年月日这个区域的*/

    ::-webkit-datetime-edit-text {  } /*这是控制年月日之间的斜线或短横线的*/

    ::-webkit-datetime-edit-year-field {  } /*控制年文字, 如2013四个字母占据的那片地方*/

    ::-webkit-datetime-edit-month-field {  } /*控制月份*/

    ::-webkit-datetime-edit-day-field { } /*控制具体日子*/
  }
  ::placeholder {
    // color: ${({ theme }) => theme.text4};
    color:#DADADA;
  }
  ${({ theme }) => theme.mediaWidth.upToLarge`
    width: 100%;
    margin-right: 0;
    // height: 50px;
    // line-height: 50px;
    // font-size: 24px;
  `};
`

const DateInputIcon = styled.div`
  ${({ theme }) => theme.flexC};
  width: 56.8px;
  height:56.8px;
  position: absolute;
  top:0;right:0;bottom:0;
  background-color: ${({ theme }) => theme.bodyBg};
`

const ClockIcon = styled(Clock)`
  font-size: 48px;
  width: 36.8px;
  height:36.8px;
  color: ${({ theme }) => theme.textColorBold};
`

const CheckoutGroup = styled.div`
${({ theme }) => theme.flexSC};
flex-wrap:wrap;
// padding: 0 20px;
margin-top:10px;
  // ${({ theme }) => theme.mediaWidth.upToMedium`
  //   height: 28px;
  //   margin-bottom: 10px;
  // `}
`
const CheckoutLabel = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width:100%;
  `}

`
const CheckoutItem = styled.div`
${({ theme }) => theme.flexSC};
flex-wrap:wrap;
`
const RadioStyle = styled.input`
  top: 0;
  left: 0;
  width: 100%;
  cursor: inherit;
  height: 100%;
  margin: 0;
  opacity: 0;
  padding: 0;
  z-index: 1;
  position: absolute;
`

const RadioLabel = styled.label`
  ${({ theme }) => theme.flexSC};
  height:42px;
  position:relative;
  margin-right:15px;
  .radioBox {
    ${({ theme }) => theme.flexC};
    height:100%;
    width: 42px;
    .radioBtn{
      ${({ theme }) => theme.flexC};
      width:24px;
      height:24px;
      .radio-init {
        width:100%;
        height:100%;
        border-radius: 100%;
        border: 3px solid #6c57ec;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      }
      .radio-selected {
        width:100%;
        height:100%;
        border-radius: 100%;
        border: 3px solid #6c57ec;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        padding: 4px;
        .round {
          width:100%;
          height:100%;
          display:block;
          border-radius:100%;
          background: #6c57ec;
        }
      }
    }
  }
  .radioTxt {
    font-size:12px;
    color: ${({ theme }) => theme.text1};
    white-space:nowrap;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    // width:100%;
    margin-right:5px;
  `}
`

function RadiosStyle ({
  id,
  value,
  selected,
  label,
  onRadioChange,
  type = 'radio'
}: {
  id:any
  value:any
  selected:any
  label:any
  onRadioChange: (value: any) => void
  type?:any
}) {
  return (
    <>
      <RadioLabel>
        <span className="radioBox">
          <span className="radioBtn">
            <RadioStyle value={value} name={id} type={type} checked={selected === value ? true : false} onChange={onRadioChange} />
            {
              selected === value ? <div className="radio-selected"><i className="round"></i></div> : <div className="radio-init"></div>
            }
          </span>
        </span>
        <span className="radioTxt">{label}</span>
      </RadioLabel>
    </>
  )
}

const initweek = INIT_TIME

export default function LockAmount ({
  lockEnds,
  updateLockDuration,
  type,
  minDate,
}: {
  lockEnds:any
  updateLockDuration: (value: any) => void,
  type: string
  minDate?: string
}) {

  const inputEl = useRef<any>(null);

  const [selectedDate, setSelectedDate] = useState(lockEnds ? lockEnds : moment().add(initweek, 'days').format('YYYY-MM-DD'));
  const [selectedValue, setSelectedValue] = useState<any>(type === 'create' ? 'week' : 'week');
// console.log(minDate)
  // let min = minDate ? minDate : moment().add(7, 'days').format('YYYY-MM-DD')
  // const lockDuration = lockEnds ? moment(lockEnds).unix() : undefined
  // if(lockDuration && new BigNumber(lockDuration).gt(0)) {
  //   if (minDate && moment(minDate).unix() > lockDuration) {
  //     min = minDate
  //   } else {
  //     min = moment.unix(lockDuration).format('YYYY-MM-DD')
  //   }
  // }

  const lockDuration = useMemo(() => {
    return lockEnds ? moment(lockEnds).unix() : undefined
  }, [lockEnds])

  const min = useMemo(() => {
    // console.log(minDate)
    // console.log(lockDuration ? moment.unix(lockDuration).format('YYYY-MM-DD') : '')
    if (lockDuration && !minDate) {
      if (new BigNumber(lockDuration).gt(0)) {
        return moment.unix(lockDuration).format('YYYY-MM-DD')
      }
      return moment().add(initweek, 'days').format('YYYY-MM-DD')
    } else if (minDate && !lockDuration) {
      if (minDate) {
        return minDate
      } else {
        return moment().add(initweek, 'days').format('YYYY-MM-DD')
      }
    } else if (lockDuration && minDate) {
      const md = moment(minDate).unix()
      if (md > lockDuration) {
        // setSelectedDate(minDate)
        // updateLockDuration(minDate)
        return minDate
      } else {
        return moment.unix(lockDuration).format('YYYY-MM-DD')
      }
    }
    return moment().add(initweek, 'days').format('YYYY-MM-DD')
  }, [lockDuration, minDate])

  useEffect(() => {
    if (lockDuration && minDate) {
      const md = moment(minDate).unix()
      if (md > lockDuration) {
        setSelectedDate(minDate)
        updateLockDuration(minDate)
      }
    }
  }, [lockDuration, minDate])

  const handleDateChange = (event:any) => {
    setSelectedDate(event.target.value);
    setSelectedValue(null);

    updateLockDuration(event.target.value)
  }

  const handleChange = (event:any) => {
    setSelectedValue(event.target.value);

    let days = 0;
    switch (event.target.value) {
      case 'week':
        days = type === 'create' ? initweek : initweek + 1;
        break;
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      case 'years':
        days = type === 'create' ? 1460 : 1461;
        break;
      default:
    }
    // const mt = minDate ? minDate : ''
    const useDate = moment().add(days, 'days')
    let selectDate = moment().add(days, 'days')
    if (minDate) {
      const ut = useDate.unix()
      const mt = moment(minDate).unix()
      if (mt > ut){
        selectDate = moment(minDate)
      }
    }
    const newDate = selectDate.format('YYYY-MM-DD')

    setSelectedDate(newDate);
    updateLockDuration(newDate)
  }

  const focus = () => {
    if(inputEl?.current) {
      inputEl.current.focus()
    };
  }

  return (
    <>
      <SwapInputBox>
        <CurrencySelect1 selected={true} className="open-currency-select-button">
          <TokenLogoBox1 onClick={ focus }>
            <TokenLogo symbol={'DATE'} size={'100%'} />
          </TokenLogoBox1>
        </CurrencySelect1>
        <SwapInputContent style={{width: '100%'}}>
          <DateInputBox>

            <DateInput
              value={ selectedDate }
              ref={inputEl}
              onChange={ handleDateChange }
              type="date"
              placeholder='Expiry Date'
              min={min}
              max={moment().add(1460, 'days').format('YYYY-MM-DD')}
              disabled={false}
            />
            <DateInputIcon>
              <ClockIcon />
            </DateInputIcon>
            <DateInput1
              value={ selectedDate }
              // ref={inputEl}
              onChange={ handleDateChange }
              type="date"
              placeholder='Expiry Date'
              min={min}
              max={moment().add(1460, 'days').format('YYYY-MM-DD')}
              disabled={false}
            />
          </DateInputBox>
        </SwapInputContent>
      </SwapInputBox>
      <CheckoutGroup>
        <CheckoutLabel>Expires:</CheckoutLabel>
        <CheckoutItem>
          <RadiosStyle
            id='lockDate'
            value='week'
            selected={selectedValue}
            label='2 week'
            onRadioChange={handleChange}
          ></RadiosStyle>
          <RadiosStyle
            id='lockDate'
            value='month'
            selected={selectedValue}
            label='1 month'
            onRadioChange={handleChange}
          ></RadiosStyle>
          <RadiosStyle
            id='lockDate'
            value='year'
            selected={selectedValue}
            label='1 year'
            onRadioChange={handleChange}
          ></RadiosStyle>
          <RadiosStyle
            id='lockDate'
            value='years'
            selected={selectedValue}
            label='4 years'
            onRadioChange={handleChange}
          ></RadiosStyle>
        </CheckoutItem>
      </CheckoutGroup>
    </>
  )
}