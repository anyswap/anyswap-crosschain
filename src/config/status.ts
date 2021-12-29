export enum Status {
  Pending = "Pending",
  Success = "Success",
  Failure = "Failure",
  Null = "Null",
  Confirming = "Confirming",
  Crosschaining = "Crosschaining",
  Timeout = "Timeout",
  BigAmount = "Big Amount",
}

export function getStatus (status:any) {
  let statusType = ''
  if ([2, 4, 6, 11, 14].includes(status)) {
    statusType = Status.Pending
  } else if ([0, 5, 8].includes(status)) {
    statusType = Status.Confirming
  } else if ([7, 9].includes(status)) {
    statusType = Status.Crosschaining
  } else if ([10].includes(status)) {
    statusType = Status.Success
  } else if ([1, 3, 16].includes(status)) {
    statusType = Status.Failure
  } else if ([20].includes(status)) {
    statusType = Status.Timeout
  } else if ([12].includes(status)) {
    statusType = Status.BigAmount
  }
  return statusType
}

export const END_STATUS = [1, 3, 10, 16,-2]