import {
  differenceInDays,
  eachYearOfInterval,
  endOfYear,
  startOfYear,
} from 'date-fns'
import { DateRange } from '../store/types'
import {
  COMBAT_RATE,
  FAMILY_CARE_COMPENSATION,
  MENTAL_HEALTH_COMPENSATION,
  NON_COMBAT_RATE,
  SPECIAL_NEEDS_COMPENSATION,
} from './constants'

export const calculateVacation = (
  totalDays: number,
  hasChildren: boolean,
  isCombat: boolean
) => {
  if (totalDays < 60) return 0

  const baseVacation = isCombat ? 3500 : 1500
  const additionalForChildren = isCombat ? 1000 : 500

  return hasChildren ? baseVacation + additionalForChildren : baseVacation
}

export const calculateCompensationPerYear = (daysPerYear: number[]) => {
  const compensationPerYear = daysPerYear.map((days) => {
    let compensation = 0

    if (days >= 9) compensation += 1410
    if (days >= 14) compensation += 1410
    if (days >= 20) compensation += 1410
    if (days >= 37) compensation += 1410
    if (days >= 32) compensation += (days - 31) * 133

    return compensation
  })

  return compensationPerYear
}

export const getDaysForEachYear = (
  dateRanges: { startDate: Date; endDate: Date }[],
  serviceBefore: number
) => {
  const yearsMap = new Map()
  let addedServiceBefore = false

  dateRanges.forEach(({ startDate, endDate }) => {
    const interval = { start: startDate, end: endDate }
    const years = eachYearOfInterval(interval)

    years.forEach((date, index) => {
      const year = date.getFullYear()
      const start = index === 0 ? startDate : startOfYear(date)
      const end = index === years.length - 1 ? endDate : endOfYear(date)

      let days = differenceInDays(end, start) + 1

      // Add serviceBefore only once to the year 2023
      if (year === 2023 && !yearsMap.has(2023) && !addedServiceBefore) {
        days += serviceBefore
        addedServiceBefore = true
      }

      yearsMap.set(year, (yearsMap.get(year) || 0) + days)
    })
  })

  return Array.from(yearsMap)
    .sort((a, b) => a[0] - b[0])
    .map((entry) => entry[1])
}

const calculateDays = (dateRanges: { startDate: Date; endDate: Date }[]) => {
  let total = 0
  dateRanges.forEach(({ startDate, endDate }) => {
    total += differenceInDays(endDate, startDate)
  })

  return total
}

const calculateMonthlyCompensation = (isCombat: boolean, days: number) => {
  if (days < 40) return 0
  const rate = isCombat ? COMBAT_RATE : NON_COMBAT_RATE

  const total = Math.floor((days - 30) / 10) * rate
  return total
}

const calculateChildrenCompensation = (isCombat: boolean, days: number) => {
  // 833 for combat for each 10 days
  //500 for non combat for each 10 days
  if (days < 40) return 0
  const rate = isCombat ? 833 : 500
  const total = Math.floor((days - 30) / 10) * rate
  return total
}

const operation24Calculation = (operation24Days: number) => {
  // 100 per day for first 10 days
  // extra 150 per day for 11 to 20 days
  // extra 200 per day from 21 and on
  if (operation24Days <= 0) return 0

  let totalAmount = 0

  // Calculate for the first 10 days
  const firstTierDays = Math.min(operation24Days, 10)
  totalAmount += firstTierDays * 100

  // Calculate for days 11 to 20
  if (operation24Days > 10) {
    const secondTierDays = Math.min(operation24Days - 10, 10)
    totalAmount += secondTierDays * 150 // 100 + 150
  }

  // Calculate for days 21 and beyond
  if (operation24Days > 20) {
    const thirdTierDays = operation24Days - 20
    totalAmount += thirdTierDays * 200 // 100 + 200
  }

  return totalAmount
}

// const calculateDaysInOctober2023 = (
//   dateRanges: {
//     startDate: Date
//     endDate: Date
//   }[]
// ) => {
//   // מחולק לשנתי ונוסף
//   // הראשון לפי מדרגות
//   // התגמול המיוחד

//   //  אם עשית מעל 60 יום לפני ה-7.10 33-המחשבון יעצור ביום ה60
//   //  *32

//   //  אם עשית מעל 60 יום לפני ה-7.10 33-המחשבון יעצור ביום ה60
//   // מהיום ה61 מקבל

//   const octoberStart = new Date('2023-10-01')
//   const octoberEnd = new Date('2023-11-16')

//   let total = 0

//   dateRanges.forEach(({ startDate, endDate }) => {
//     // Find the later of the two start dates
//     const overlapStart = startDate > octoberStart ? startDate : octoberStart

//     // Find the earlier of the two end dates
//     const overlapEnd = endDate < octoberEnd ? endDate : octoberEnd

//     // Check if there is an overlap
//     if (overlapStart <= overlapEnd) {
//       // +1 because the end date is inclusive
//       total +=
//         (overlapEnd.getTime() - overlapStart.getTime()) /
//           (1000 * 60 * 60 * 24) +
//         1
//     }
//   })

//   return total
// }

// const daysBeforeCalculation = (daysBefore: number, daysStraight: boolean) => {
//   // 10-14.5 = 1410
//   // 15-19.5 = 2820
//   // 20-36.5 = 4230
//   //37 and above = 5640
//   // did you do 5-9 days straight 266
//   let total = 0
//   if (daysBefore >= 10 && daysBefore <= 14.5) {
//     total = 1410
//   } else if (daysBefore >= 15 && daysBefore <= 19.5) {
//     total = 2820
//   } else if (daysBefore >= 20 && daysBefore <= 36.5) {
//     total = 4230
//   } else if (daysBefore >= 37) {
//     total = 5640
//   }

//   return total + (daysStraight ? 266 : 0)
// }

// const special = (days: number) => {
//   // from 33-60 max 28
//   // are you commander?
//   // if you after 61
// }

// const calculateSpecialCompensation = (
//   daysWar: number,
//   daysBeforeWar: number
// ) => {}

export const calculateCompensation = (inputs: {
  dateRanges: DateRange[]
  operation24Days: string
  isCombat: boolean
  hasChildren: boolean
  hasChildrenSpecial: boolean
  serviceBefore: string
}) => {
  const {
    dateRanges: dateRangesString,
    operation24Days: operation24DaysString,
    isCombat,
    hasChildren,
    hasChildrenSpecial,
    serviceBefore: serviceBeforeString,
  } = inputs

  // date Ranges to dates
  const dateRanges = dateRangesString.map((dateRange) => {
    return {
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.endDate),
    }
  })

  const serviceBefore = parseFloat(serviceBeforeString)
  const operation24Days = parseFloat(operation24DaysString)

  const daysWar = calculateDays(dateRanges)
  // const daysInOctober2023 = calculateDaysInOctober2023(dateRanges)

  let totalPerMonth = calculateMonthlyCompensation(
    isCombat,
    Math.max(daysWar, 0)
  ) //ok
  let totalOperation24 = operation24Calculation(operation24Days)
  let totalMoreThan45 = isCombat && daysWar > 45 ? 2500 : 0 //ok

  let totalFromChildren = hasChildren
    ? calculateChildrenCompensation(isCombat, daysWar)
    : 0 //ok
  let totalVacation = calculateVacation(daysWar, hasChildren, isCombat)
  let totalSpecialChildren = hasChildrenSpecial ? SPECIAL_NEEDS_COMPENSATION : 0

  let totalMental = daysWar > 30 ? MENTAL_HEALTH_COMPENSATION : 0
  let totalFamilyCare = FAMILY_CARE_COMPENSATION

  let totalDedication = 0

  const compensationPerYear = calculateCompensationPerYear(
    getDaysForEachYear(dateRanges, serviceBefore)
  )

  return {
    totalPerMonth,
    totalMoreThan45,
    totalOperation24,
    totalFromChildren,
    totalVacation,
    totalSpecialChildren,
    totalMental,
    totalFamilyCare,
    compensationPerYear,
    totalDedication,
  }
}
