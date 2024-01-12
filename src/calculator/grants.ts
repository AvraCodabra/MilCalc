import { Grant, PayType, Profile } from '../store/types'
import { operation24Calculation } from './calculator'

// *****     תגמולים      ***** //

//התגמול המיוחד
export function getSpecialReward2023(days2023: number) : Grant {
  const name = "2023 התגמול המיוחד"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 5, 1);
  const rewardAmountPerDay = 133

  const specialRewardCalc = (): number => {
    return Math.max(days2023 - 32, 0) * rewardAmountPerDay
  }

  return { amount : specialRewardCalc(), name, payType, payDate }
}

//התגמול הנוסף
export function getAdditionalReward2023(days2023: number) : Grant {
  const name = "2023 התגמול הנוסף"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 5, 1);

  const additionalRewardCalc = (): number => {
    switch (true) {
      case days2023 >= 37:
        return 5640;
      case days2023 >= 20 && days2023 <= 36.5:
        return 4230;
      case days2023 >= 15 && days2023 <= 19.5:
        return 2820;
      case days2023 >= 10 && days2023 <= 14.5:
        return 1410;
      default:
        return 0;
    }
  }

  return { amount: additionalRewardCalc(), name, payType, payDate }
}

//(5 ימים רצופים) תגמול עבור הוצאות אישיות
export function getPersonalExpensesReward2023(days2023: number, is5DaysStraight: boolean) : Grant {
  const name = "2023 תגמול עבור הוצאות אישיות"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 5, 1);
  const rewardAmount = 266

  const personalExpensesRewardCalc = (): number => {
    if (is5DaysStraight && days2023 < 1)
      return rewardAmount
    else
      return 0
  }

  return { amount : personalExpensesRewardCalc(), name, payType, payDate }
}

//תגמול למוחרגי גיל
export function getOldAgeReward2023(days2023: number, profile: Profile) : Grant {
  const name = "תגמול למוחרגי גיל"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 5, 1);
  const ratePerDay = 133

  const oldAgeRewardCalc = (): number => {
    if (profile.isOld)
      return days2023 * ratePerDay
    else
      return 0
  }

  return { amount: oldAgeRewardCalc(), name, payType, payDate }
}


// *****     מענקים  - חרבות ברזל      ***** //


//מענק הוצאות אישיות
export function getPersonalExpensesGrant2023(daysInWar: number) : Grant {
  const name = "מענק הוצאות אישיות"
  const payType = PayType.SINGLE
  const payDate = new Date(2023, 11, 10);

  const personalExpensesGrantCalc = (): number => {
    if (daysInWar >= 8)
      return 1100
    else
      return 0
  }

  return { amount: personalExpensesGrantCalc(), name, payType, payDate }
}

//מענק משפחה
export function getFamilyGrant(daysInWar: number, profile: Profile) : Grant {
  const name = "מענק משפחה"
  const payType = PayType.SINGLE
  const payDate = new Date(2023, 11, 10);

  const familyGrantCalc = (): number => {
    if (daysInWar >= 8 && profile.haChildrenUnder14)
      return 2000
    else
      return 0
  }

  return { amount: familyGrantCalc(), name, payType, payDate }
}


//מענק הוצאות אישיות מוגדל
export function getExtendedPersonalExpensesGrant(daysInWar2023: number, profile: Profile) : Grant {
  const name = "מענק הוצאות אישיות מוגדל"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 1, 14);
  const combatRate = 466
  const nonCombatRate = 266

  const extendedPersonalExpensesCalc = (): number => {
    if (daysInWar2023 < 40) return 0
    const rate = profile.isCombat ? combatRate : nonCombatRate
    return  Math.floor((daysInWar2023 - 30) / 10) * rate
  }
  return { amount: extendedPersonalExpensesCalc(), name, payType, payDate }
}


//מענק לחימה
export function getCombatGrant2024(operationDays:number) : Grant {
  const name = "מענק לחימה"
  const payType = PayType.MONTHLY
  return { amount: operation24Calculation(operationDays), name, payType }
}

//מענק התמדה
export function getPersistenceGrant(daysInWar: number,normalDays2024: number) : Grant{
  const name = "מענק התמדה"
  const payType = PayType.MONTHLY

  const persistenceGrantCalc = (): number => {
    if (daysInWar >= 60)
      return normalDays2024 * 100
    else
      return 0
  }

  return { amount: persistenceGrantCalc(), name, payType }
}


//מענק משפחה מוגדל
export function getExtendedFamilyGrant2023(daysInWar2023: number, profile: Profile) : Grant {
  const name = "מענק משפחה מוגדל"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 1, 14);
  const combatRate = 833 // for each 10 days
  const nonCombatRate = 500 // for each 10 days

  const extendedFamilyGrantCalc = (): number => {
    if (daysInWar2023 >= 40 && profile.haChildrenUnder14) {
      const rate = profile.isCombat ? combatRate : nonCombatRate
      return Math.floor((daysInWar2023 - 30) / 10) * rate
    }
    else
      return 0
  }

  return { amount: extendedFamilyGrantCalc(), name, payType, payDate }
}

//מענק משפחה מיוחדת
export function getSpecialFamilyGrant(daysInWar2023: number, profile: Profile) : Grant {
  const name = "מענק משפחה מיוחדת"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 3, 1);

  const specialFamilyCalc = (): number => {
    if (daysInWar2023 >= 45 && profile.hasSpecialChildren)
      return 2000
    else
      return 0
  }

  return { amount: specialFamilyCalc(), name, payType, payDate }
}

//מענק כלכלת בית מוגדל
export function getExtendedHomeEconomicsGrant(daysInWar: number, profile: Profile) : Grant {
  const name = "מענק כלכלת בית מוגדל"
  const payType = PayType.SINGLE
  const payDate = new Date(2024, 9, 1);
  const combatAmount = 1250
  const nonCombatAmount = 2500

  const extendedHomeEconomicsGrantCalc = (): number => {
    if (daysInWar>45)
      return profile.isCombat ? combatAmount : nonCombatAmount
    else
      return 0
  }

  return { amount: extendedHomeEconomicsGrantCalc(), name, payType, payDate }
}

//שובר חופשה
export function getVacationVoucher(daysInWar: number, profile: Profile) : Grant {
  const name = "שובר חופשה"
  const payType = PayType.DEMAND
  const {isCombat, haChildrenUnder14} = profile

  const vacationVoucherCalc = (): number => {
    if (daysInWar < 60) return 0

    switch (true) {
      case !isCombat && !haChildrenUnder14:
        return 1500
      case !isCombat && haChildrenUnder14:
        return 2000
      case isCombat && !haChildrenUnder14:
        return 3500
      case isCombat && haChildrenUnder14:
        return 4500
    }
    return 0
  }

  return { amount: vacationVoucherCalc(), name, payType }
}

//טיפול זוגי
export function getCouplesTherapyGrant(daysInWar: number) : Grant {
  const name = "טיפול זוגי"
  const payType = PayType.DEMAND

  const couplesTherapyGrantCalc = (): number => {
    if (daysInWar >= 30)
      return 1500
    else
      return 0
  }

  return { amount: couplesTherapyGrantCalc(), name, payType }
}

//טיפול רגשי, נפשי וטיפול משלים
export function getTherapyGrant(daysInWar: number) : Grant {
  const name = "טיפול רגשי, נפשי וטיפול משלים"
  const payType = PayType.DEMAND

  const therapyGrantCalc = (): number => {
    if (daysInWar >= 30)
      return 1500
    else
      return 0
  }

  return { amount: therapyGrantCalc(), name, payType }
}
