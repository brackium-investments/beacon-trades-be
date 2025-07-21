export const dateDiffInDays = (date1: number, date2: number) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffInMilliseconds = date2 - date1;
  return Math.round(diffInMilliseconds / oneDay);
};
