/**
 * @license
 * Copyright {organization} All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at {url for License page}
 */

import { Constants } from "./Constants";

export class FinancialExpression {

  /**
   * 
   * @method pv
   * @param interestRate {number} interestRate per month, e.g., 4.5% should be 4.5/100/12
   * @param loanTerm {number} total number of months, e.g, 5 years should be 5*12
   * @param monthlyPayment {number} EMI
   * @returns
   * 
   * @description
   * Formula:
   * ```
   *  FV := numerator / denominator 
   *    numerator := P * (1 - (1 / ((1 + r) ^ n) ) ) 
   *    denominator := r 
   *  P := monthly payment; r := interest rate; n := loan terms
   * 
   * ```
   * @example
   * ```JS
   *  pv(4.5/100/12, 10*12, 4000) // returns "385957.29"
   *  pv(6/100/12, 5*12, 10000) // returns "517255.60"
   * 
   * ```
   */
  pv = async (
    interestRate: number,
    loanTerm: number,
    monthlyPayment: number): Promise<string> => {

    let output: string = Constants.INVALID_INPUTVALUES;

    const isValidInterestRate: boolean = parseFloat(interestRate.toString()) != NaN;
    const isValidMonthlyPayment: boolean = parseFloat(monthlyPayment.toString()) != NaN;
    const isValidLoanTerm: boolean = Number.isInteger(loanTerm);

    const isValidArgs: boolean = isValidInterestRate && isValidLoanTerm && isValidMonthlyPayment;

    if (!!isValidArgs) {
      const onePlusRWholePowerN: number = (1 + interestRate) ** loanTerm;
      const numerator: number = monthlyPayment * (1 - (1 / onePlusRWholePowerN));
      const denominator: number = interestRate;
      const PV: number = numerator / denominator;
      output = PV.toFixed(2).toString();
    }
    return output;
  }

  /**
   * 
   * @method fv
   * @param interestRate {number} interestRate per month, e.g., 4.5% should be 4.5/100/12
   * @param loanTerm {number} total number of months, e.g, 5 years should be 5*12
   * @param monthlyPayment {number} EMI
   * @returns 
   * 
   * @description
   * Formula:
   * ```
   *  FV := numerator / denominator
   *    numerator := P * ( ((1 + r) ^ n) - 1)
   *    denominator := r
   *  P := monthly payment; r := interest rate; n := loan terms
   * 
   * ```
   * @examples
   * ```JS
   *  fv(4.5/100/12, 10*12, 4000) // returns "604792.29"
   *  fv(6/100/12, 5*12, 10000) // returns "697700.30"
   * 
   * ```
   */
  fv = async (
    interestRate: number,
    loanTerm: number,
    monthlyPayment: number): Promise<string> => {

    let output: string = Constants.INVALID_INPUTVALUES;

    const isValidInterestRate: boolean = parseFloat(interestRate.toString()) != NaN;
    const isValidMonthlyPayment: boolean = parseFloat(monthlyPayment.toString()) != NaN;
    const isValidLoanTerm: boolean = Number.isInteger(loanTerm);

    const isValidArgs: boolean = isValidInterestRate && isValidLoanTerm && isValidMonthlyPayment;

    if (!!isValidArgs) {
      const onePlusRWholePowerN: number = (1 + interestRate) ** loanTerm;
      const numerator: number = monthlyPayment * (onePlusRWholePowerN - 1);
      const denominator: number = interestRate;
      const FV: number = numerator / denominator;
      output = FV.toFixed(2).toString();
    }
    return output;
  }

  /**
   * 
   * @method pmt
   * @param interestRate {number} interestRate per month, e.g., 4.5% should be 4.5/100/12. 
   * @param loanTerm {number} total number of months, e.g, 5 years should be 5*12
   * @param loanAmount {number} principal amount
   * @returns {string} monthly repayment
   * 
   * @description
   * Formula:
   * ```
   *  PMT := numerator / denominator
   *    numerator := P * ( ( r * ((1 + r) ^ n))
   *    denominator := ( ((1 + r) ^ n) - 1) )
   *  P := principal or loan amount; r := interest rate; n := loan terms
   * 
   * ``` 
   * @examples
   * ```JS
   *  pmt(5/100/12, 5*12, 100000)       // returns "1887"
   *  pmt(5/100/12, 10*12, 100000)      // returns "1060"
   *  
   * ```
   */
  pmt = async (
    interestRate: number,
    loanTerm: number,
    loanAmount: number): Promise<string> => {

    let output: string = Constants.INVALID_INPUTVALUES;

    const isValidInterestRate: boolean = parseFloat(interestRate.toString()) != NaN;
    const isValidLoanAmount: boolean = parseFloat(loanAmount.toString()) != NaN;
    const isValidLoanTerm: boolean = Number.isInteger(loanTerm);

    const isValidArgs: boolean = isValidInterestRate && isValidLoanTerm && isValidLoanAmount;

    if (!!isValidArgs) {
      const onePlusRWholePowerN: number = (1 + interestRate) ** loanTerm;
      const numerator: number = loanAmount * (interestRate * onePlusRWholePowerN);
      const denominator: number = onePlusRWholePowerN - 1;
      const PMT: number = numerator / denominator;
      output = Math.floor(PMT).toString();
    } else {
      throw new Error("interestRate, loanTerm, and loanAmount must be a number.")
    }
    return output;
  }

  /**
   * 
   * @method parseBalancedLoanAmountExpr
   * @param inputExp {string} an expression with loan details
   * @returns {LoanDetails}
   * 
   * @description
   * Parses the inputExp and returns LoanDetails object with properties `loanAmount`,
   * `interestRate`, `loanTerm` and `monthlyRepayment`. 
   * 
   * @examples
   * ```JS
   *  parseBalancedLoanAmountExpr("100000: 4.5 : 4000 : 60")  
   *    
   * // returns
   * {
   *  loanAmount: 100000,
   *  interestRate: 4.5,
   *  loanTerm: 60,
   *  monthlyRepayment: 4000 
   * }
   * 
   * ```
   */
  private parseBalancedLoanAmountExpr = async (inputExp: string): Promise<LoanDetails> => {
    let output: LoanDetails = {
      loanAmount: 0.0,
      interestRate: 0.0,
      loanTerm: 0,
      monthlyRepayment: 0.0
    };
    try {
      let regex: RegExp = new RegExp(Constants.BALANCED_LOAN_AMOUNT_REGEX);
      if (regex.test(inputExp)) {
        let groupVariables = regex.exec(inputExp)?.groups;
        if (!!groupVariables) {
          const loanAmount: string = groupVariables?.["PRINCIPAL"];
          const interestRate: string = groupVariables?.["INTERESTRATE"];
          const loanTerm: string = groupVariables?.["TERMS"];
          const monthlyRepayment: string = groupVariables?.["MONTHLYREPAYMENT"];

          output.loanAmount = parseFloat(loanAmount);
          output.interestRate = parseFloat(interestRate);
          output.loanTerm = parseInt(loanTerm);
          output.monthlyRepayment = parseFloat(monthlyRepayment);
        } else {
          throw new Error(`No groups found for the expression: ${inputExp}`)
        }
      } else {
        throw new Error(`Input expression: ${inputExp} is not a valid expression.`)
      }
    } catch (ex) {
      throw new Error(`Error in evaluating the expression ${inputExp}`)
    }
    return output;
  }

  /**
   * 
   * @method balance
   * @param inputExp {string} an expression with loan details
   * @returns {string}
   * 
   * @description
   * Returns the balanced loan amount calculated from parsed inputExp.
   * 
   * @examples
   * ```JS
   *  balance("100000 : 5 : 1061 : 60")  // returns "56181.41"
   *  balance("100000:5:1061:60")        // returns "56181.41"
   * 
   * ```
   */
  balance = async (inputExp: string): Promise<string> => {
    let output: string = Constants.INVALID_EXPRESSION;
    try {
      const loanDetails: LoanDetails = await this.parseBalancedLoanAmountExpr(inputExp);
      const interestRate: number = loanDetails.interestRate;
      const loanTerms: number = loanDetails.loanTerm;
      const monthlyRepayment: number = loanDetails.monthlyRepayment;
      const loanAmount: number = loanDetails.loanAmount;

      const balancedAmount = await this.getBalancedLoanAmount(
        loanAmount,
        interestRate,
        loanTerms,
        monthlyRepayment
      );
      output = balancedAmount.toFixed(2).toString();
    } catch (ex) {
      throw new Error(`Error in parsing the expression: ${inputExp}`);
    }
    return output;
  }

  /**
   * 
   * @method getBalancedLoanAmount
   * @param loanAmount {number} principal or loan amount
   * @param interestRate {number} annual interest rate. E.g., 5 for 5% 
   * @param loanTerms {number} total number of months required to finish the loan
   * @param monthlyRepayment {number} amount to be paid as EMI
   * @returns {number}
   * 
   * @description 
   * Returns balanced loan amount after addition of interest accrued and subtraction of EMI.
   * 
   * @exmaples
   * ```JS
   *  getBalancedLoanAmount(100000, 5, 5 * 12, 1061) // returns 56181.413956216784
   * 
   * ```
   */
  private getBalancedLoanAmount = async (
    loanAmount: number,
    interestRate: number,
    loanTerms: number,
    monthlyRepayment: number
  ): Promise<number> => {

    const isValidLoanAmount: boolean = (typeof loanAmount == 'number') &&
      parseFloat(loanAmount.toString()) != NaN;
    const isValidInterestRate: boolean = (typeof interestRate == 'number') &&
      parseFloat(interestRate.toString()) != NaN;
    const isValidLoanTerms: boolean = (typeof loanTerms == 'number') &&
      parseInt(loanTerms.toString()) != NaN;
    const isValidMonthlyRepayment: boolean = (typeof loanTerms == 'number') &&
      parseFloat(monthlyRepayment.toString()) != NaN;

    const isValidArgs: boolean = isValidLoanAmount &&
      isValidInterestRate &&
      isValidLoanTerms &&
      isValidMonthlyRepayment;

    if (!!isValidArgs) {
      let _interestRate: number = (interestRate / 100) / 12;
      let balancedLoanAmount: number = loanAmount;
      for (let i: number = 0; i < loanTerms; ++i) {
        balancedLoanAmount += (balancedLoanAmount * _interestRate) - monthlyRepayment;
      }
      return balancedLoanAmount;
    } else {
      throw new Error(`loanAmount, interestRate, loanTerms, and monthlyRepayment must be a number.`)
    }
  }

  /**
   * @method rate
   * @param loanAmount {number} principal or loan amount
   * @param loanTerms {number} total number of months required to finish the loan
   * @param monthlyRepayment {number} amount to be paid as EMI
   * @returns {string}
   * 
   * @description
   * Returns the annual interest rate (in percent, %) predicted iteratively based on
   * the given loan amount, loan terms, and monthly repayment (EMI). 
   * 
   * @examples
   * ```JS
   *  rate(100000, 10*12, 1061) // returns 4.867 %
   * 
   * ``` 
   */
  rate = async (
    loanAmount: number,
    loanTerms: number,
    monthlyRepayment: number
  ): Promise<string> => {
    if (!!loanAmount && !!loanTerms && !!monthlyRepayment) {
      let possibleInterestRate: number = 0.000;
      while (true) {
        const balanceAmount: number = await this.getBalancedLoanAmount(
          loanAmount,
          possibleInterestRate,
          loanTerms,
          monthlyRepayment
        );
        if (balanceAmount <= 0) {
          if (balanceAmount == 0) {
            break;
          } else {
            const positiveBalanceAmount: number = (-1 * balanceAmount);
            if (positiveBalanceAmount <= monthlyRepayment) {
              break;
            }
          }
        }
        possibleInterestRate += 0.001;
      }
      return `${possibleInterestRate.toFixed(3)} %`;
    } else {
      throw new Error(`loanAmount, loanTerms, and monthlyRepayment must be a number.`)
    }
  }

}

type LoanDetails = {
  loanAmount: number,
  interestRate: number,
  monthlyRepayment: number,
  loanTerm: number
}