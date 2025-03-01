function getMonthDifference(startDate, endDate) {
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  const daysDiff = endDate.getDate() - startDate.getDate();

  let monthDifference = yearsDiff * 12 + monthsDiff;

  if (daysDiff > 0) {
    monthDifference++;
  }

  return monthDifference;
}

module.exports = { getMonthDifference };
