export const extensionId = `KIRISAME_EXT_YTF`;

export const utils = {
  // biome-ignore lint/suspicious/noExplicitAny: debugging only
  debug: (...args: any[]) =>
    console.debug(
      `
  \n┌( \´_ゝ\` )┐
  \nDEBUG | ${extensionId}
  \n
  `,
      ...args
    ),
};

export const numPadding = (
  num: number,
  minDigits = 3,
  padding = "0"
): string => {
  const digits = num.toString().length;
  const missingDigits = Math.max(minDigits - digits, 0);
  return padding.repeat(missingDigits) + num;
};
