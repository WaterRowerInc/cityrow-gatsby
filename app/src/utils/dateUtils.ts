const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"];

const padDay = (day: string) => (parseInt(day) < 10 ? `0${day.toString()}` : day.toString());

const padStringMonth = (month: string) => padDay((months.indexOf(month) + 1).toString());

const padNumberMonth = (month: number) => padDay((month + 1).toString()).toString();

export { months, padDay, padStringMonth, padNumberMonth };
