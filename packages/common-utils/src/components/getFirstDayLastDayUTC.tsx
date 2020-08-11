export const getFirstDayLastDayUTC = (value: Date) =>
{
  // Returns the first and last days of the month - UTC
  let fDay = new Date(Date.UTC( value.getUTCFullYear(), value.getUTCMonth(), 1))
  let month = fDay.getUTCMonth();
  month = month + 1;
  let lDay = new Date ( fDay.getUTCFullYear(), month, 1)

  return {firstDay: fDay, lastDay: lDay}
};

export default getFirstDayLastDayUTC;