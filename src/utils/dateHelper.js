import moment from 'moment';


const ONE_DAY_MS = 86400000;

const padLeft = function(orig, length, pad = '0') {
  let padded = orig;
  while (padded.length < Math.min(length, 60)) {
    padded = `${pad}${padded}`;
  }
  return padded;
};

const now = moment();
const nowYear = (now.year()).toString();
const nowMonth = (now.month() + 1).toString();
const nowDate = (now.date()).toString();
const todayDateString = `${nowYear}-${padLeft(nowMonth, 2)}-${padLeft(nowDate, 2)}`;
const todayMoment = moment(todayDateString);

export default {
  timeAgoString(date) {
    if (!date) {
      return 'Never';
    }

    const diff = moment(todayMoment).diff(date);
    if (diff < ONE_DAY_MS) {
      return 'Today';
    } else if (diff < ONE_DAY_MS * 2) {
      return 'Yesterday';
    }
    return moment(date).from(todayMoment);
  },

  currentYear: () => nowYear,
  currentMonth: () => nowMonth,
  currentDate: () => nowDate,

  isCurrentYear: (year) => year === nowYear,
  isCurrentMonth: (month) => month === nowMonth,
  isCurrentDay: (date) => date === nowDate,

  cleanDate(date) {
    return moment(date).format('MMMM Do, YYYY');
  },

  cleanDateWithTrailingDay(date) {
    return moment(date).format('MMMM Do, YYYY (dddd)');
  },

  cleanDateWithLeadingDay(date) {
    return moment(date).format('dddd, MMMM Do, YYYY');
  },

  getDateString(y, m, d) {
    return `${y}-${padLeft(m, 2)}-${padLeft(d, 2)}`;
  },

  todayDateString() {
    return todayDateString;
  }
};
