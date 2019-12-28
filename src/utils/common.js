import moment from 'moment';

export const formatDay = (date) => moment(date).format(`DD`);

export const formatHour = (date) => moment(date).format(`HH`);

export const formatMinute = (date) => moment(date).format(`mm`);

export const formatTime = (date) => moment(date).format(`hh:mm`);

export const formatDate = (date) => moment(date).format(`DD MMM`);
