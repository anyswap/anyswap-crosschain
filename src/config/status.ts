export enum Status {
  Pending = "Pending",
  Success = "Success",
  Failure = "Failure",
  Null = "Null",
  Confirming = "Confirming",
  Crosschaining = "Routing",
  Timeout = "Timeout",
  BigAmount = "Big Amount",
}

export function getStatus (status:any, confirmations?:any) {
  let statusType = Status.Confirming
  if ([0, 5].includes(status)) {
    statusType = Status.Confirming
  } else if ([7, 8].includes(status)) {
    statusType = Status.Crosschaining
  } else if ([9, 10].includes(status)) {
    if (
      status === 10
      || (confirmations && confirmations > 0)
    ) {
      statusType = Status.Success
    } else {
      statusType = Status.Crosschaining
    }
  } else if ([1,2, 4, 6, 3, 16, 11, 14, 20].includes(status)) {
    statusType = Status.Failure
  }
  // else if ([].includes(status)) {
  //   statusType = Status.Timeout
  // }
  else if ([12].includes(status)) {
    statusType = Status.BigAmount
  }
  return statusType
}

export const END_STATUS = [1, 3, 10, 16,-2, -3]