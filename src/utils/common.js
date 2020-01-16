export const capitalizeString = (string) => string.split(`-`).map((element) => element[0].toUpperCase().concat(element.slice(1))).join(`-`);

export const getDurationDays = (duration) => window.moment.duration(duration).days();

export const getDurationHours = (duration) => window.moment.duration(duration).hours();

export const getDurationMinutes = (duration) => window.moment.duration(duration).minutes();

export const formatDay = (date) => window.moment(date).format(`DD`);

export const formatTime = (date) => window.moment(date).format(`HH:mm`);

export const formatDate = (date) => window.moment(date).format(`DD MMM`);

export const isFutureDate = (date) => date > new Date();

export const isPastDate = (date) => date < new Date();
