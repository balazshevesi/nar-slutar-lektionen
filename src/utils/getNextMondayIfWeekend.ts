export default function getNextMondayIfWeekend(date: Date) {
  const resultDate = new Date(date);

  if (resultDate.getDay() === 0 || resultDate.getDay() === 6) {
    // Calculate how many days to add to get to the next Monday
    // If it's Saturday (6), add 2 days; if it's Sunday (0), add 1 day
    const daysToAdd = resultDate.getDay() === 0 ? 1 : 2;
    resultDate.setDate(resultDate.getDate() + daysToAdd);
  }

  // Set time to 00:00:00
  resultDate.setHours(1, 0, 0, 0);

  return resultDate;
}
