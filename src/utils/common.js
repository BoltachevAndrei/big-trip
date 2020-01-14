export const formatDay = (duration) => window.moment.duration(duration).days();

export const formatHour = (duration) => window.moment.duration(duration).hours();

export const formatMinute = (duration) => window.moment.duration(duration).minutes();

export const formatTime = (date) => window.moment(date).format(`HH:mm`);

export const formatDate = (date) => window.moment(date).format(`DD MMM`);

export const isFutureDate = (date) => date > new Date();

export const isPastDate = (date) => date < new Date();
