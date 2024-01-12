export interface DateRange {
  startDate: string
  endDate: string
}

export interface CalculatorResults {
  // Results
  totalPerMonth: number
  totalMoreThan45: number
  totalOperation24: number
  totalFromChildren: number
  totalVacation: number
  totalSpecialChildren: number
  totalMental: number
  totalFamilyCare: number
  totalSpecialDays: number
  totalExtended: number
  totalAdditional: number
  totalDaysStraight: number
}

export enum PayDate {
  NOV_23 = 'NOV_23',
  JAN_24 = 'JAN_24',
  MAR_24 = 'MAR_24',
  MAY_24 = 'MAY_24',
  SEP_24 = 'SEP_24',
  MONTHLY = 'MONTHLY',
  DEMAND = 'DEMAND',
  NOT_APPROVED = 'NOT_APPROVED',
}

export enum PayType {
  SINGLE = 1,
  MONTHLY = 2,
  DEMAND = 3,
  NEXT_YEAR = 4,
  NOT_APPROVED = 9,
}

export function getPayDateDescription(option: PayDate): string {
  switch (option) {
    case PayDate.NOV_23:
      return 'שולם ב 10.11.2023';
    case PayDate.JAN_24:
      return 'שולם ב 14.01.2024';
    case PayDate.MAR_24:
      return 'ישולם ב 01.03.2024';
    case PayDate.MAY_24:
      return 'ישולם ב 01.05.2024';
    case PayDate.SEP_24:
      return 'ישולם ב 01.09.2024';
    case PayDate.MONTHLY:
      return "ישולם בתחילת כל חודש"
    case PayDate.DEMAND:
      return 'יש לדרוש את המענק';
    case PayDate.NOT_APPROVED:
      return 'עדיין לא אושר';
    default:
      return 'לא ידוע';
  }
}

export interface Grant {
  name: string;
  amount: number;
  payType: PayType;
  payDate?: Date;
  explanation?: string; // how the amount was calculated
  description?: string; // additional info about the grant
}

export interface Profile {
  isCombat: boolean
  haChildrenUnder14: boolean
  hasSpecialChildren: boolean
  isCommander: boolean
  isOld: boolean
}