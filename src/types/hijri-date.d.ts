declare module 'hijri-date' {
  class HijriDate {
    constructor(date: Date);
    getDate(): number;
    getMonth(): number;
    getFullYear(): number;
  }
  export default HijriDate;
}
