export const formatDay = (startDate, endDate) => window.moment.duration(window.moment(endDate).diff(window.moment(startDate))).days();

export const formatHour = (startDate, endDate) => window.moment.duration(window.moment(endDate).diff(window.moment(startDate))).hours();

export const formatMinute = (startDate, endDate) => window.moment.duration(window.moment(endDate).diff(window.moment(startDate))).minutes();

export const formatTime = (date) => window.moment(date).format(`HH:mm`);

export const formatDate = (date) => window.moment(date).format(`DD MMM`);

export const isFutureDate = (date) => date > new Date();

export const isPastDate = (date) => date < new Date();
