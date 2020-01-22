import moment from 'moment';

export const capitalizeString = (string) => string ? string.split(`-`).map((element) => element[0].toUpperCase().concat(element.slice(1))).join(`-`) : ``;

export const getDurationDays = (duration) => moment.duration(duration).days();

export const getDurationHours = (duration) => moment.duration(duration).hours();

export const getDurationMinutes = (duration) => moment.duration(duration).minutes();

export const formatDay = (date) => moment(date).format(`DD`);

export const formatTime = (date) => moment(date).format(`HH:mm`);

export const formatDate = (date) => moment(date).format(`DD MMM`);

export const isFutureDate = (date) => date > new Date();

export const isPastDate = (date) => date < new Date();
