const formatDateTime = (dateTimeString) => {
  const dateTime = new Date(dateTimeString);
  const day = dateTime.getUTCDate();
  const month = dateTime.getUTCMonth() + 1;
  const year = dateTime.getUTCFullYear();
  const hours = dateTime.getUTCHours();
  const minutes = dateTime.getUTCMinutes();
  const formattedDate = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return `${formattedTime} - ${formattedDate}`;
};
  
export default formatDateTime;
