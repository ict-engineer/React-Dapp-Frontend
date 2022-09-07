import BigNumber from "../assets/bignumber.js";

export function convertStringToHex(value: string | number): string {
  return new BigNumber(`${value}`).toString(16);
}

export function convertAmountToRawNumber(value: string | number, decimals = 18): string {
  return new BigNumber(`${value}`).times(new BigNumber("10").pow(decimals)).toString();
}
