// path consts
const INPUT_FILEPATH = "input.json";
const OUTPUT_FILEPATH = "output.json";
// load filesystem module
var fs = require('fs');
// check there is an input file, throw error if not
if (!fs.existsSync(INPUT_FILEPATH) && !fs.existsSync('bookingRules.json') && !fs.existsSync('bookingRates.json')) {
  throw new Error("MISSING FILE!");
} else {}
// load booking data
var bookingRules = JSON.parse(fs.readFileSync('bookingRules.json', 'utf8'));
var bookingRates = JSON.parse(fs.readFileSync('bookingRates.json', 'utf8'));
var bookingInput = JSON.parse(fs.readFileSync(INPUT_FILEPATH, 'utf8'));
// booking rules consts
const DAY_RATE_START_HOUR = bookingRules.dayRateStartHour;
const DAY_RATE_END_HOUR = bookingRules.dayRateEndHour;
const MIN_BOOKING_MINUTES = bookingRules.minBookingMinutes; // minutes
const MAX_BOOKING_MINUTES = bookingRules.maxBookingMinutes; // minutes
const MIN_BOOKING_INCREMENT_MINUTES = bookingRules.minBookingIncrementMinutes; // minutes
const RATE_UNIT_TIME = bookingRules.rateUnitTime; // minutes
const INCREMENT_RATE_RATIO_ADJUSTMENT = RATE_UNIT_TIME / MIN_BOOKING_INCREMENT_MINUTES;
const MLS_TO_SEC = 1000;
const SEC_TO_MIN = 60;
// output data
var bookingOutput = [];
// cycle through each booking
bookingInput.forEach(booking => {
  // booking variables
  let isValid, rate, cost, duration, startDay, endDay, startHour, endHour;
  let bookingStart = new Date(booking.to);
  let bookingEnd = new Date(booking.from);
  // calculate the duration of the booking
  duration = parseInt(((bookingStart - bookingEnd) / MLS_TO_SEC) / SEC_TO_MIN);
  // check if duration of booking fits within the minimum and maximum values
  if (duration >= MIN_BOOKING_MINUTES && duration <= MAX_BOOKING_MINUTES) {
    isValid = true;
  } else {
    isValid = false;
  }
  if (isValid) {
    // the days of the week which the booking took place
    startDay = bookingStart.getDay();
    endDay = bookingEnd.getDay();
    // the times of the day which booking took place
    startHour = bookingStart.getHours();
    endHour = bookingEnd.getHours();
    // check which rates to apply
    if (Math.min(startDay, endDay) >= DAY_RATE_START_HOUR ||
      Math.max(startHour, endHour) <= DAY_RATE_END_HOUR) {
      rate = Math.max(bookingRates[startDay].nightRate, bookingRates[endDay].nightRate);
    } else {
      rate = Math.max(bookingRates[startDay].dayRate, bookingRates[endDay].dayRate);
    }
    // calculate booking cost, hourly rate matched to increment rate, up to 2 decimals
    cost = Math.floor(((rate / INCREMENT_RATE_RATIO_ADJUSTMENT) * (duration / MIN_BOOKING_INCREMENT_MINUTES)) * 100) / 100;
  } else {
    cost = 0;
  } // when invalid booking
  // update data to be outputted
  bookingOutput.push({
    id: booking.id,
    from: booking.from,
    to: booking.to,
    isValid: isValid,
    total: cost
  });
  // uncomment the following line if you need to debug any booking variable
  bookingVarsToConsole(isValid, startDay, endDay, startHour, endHour, duration, rate, cost); 
});
// data prep and 'prettifying' for readability and then writing onto the output file
fs.writeFileSync(OUTPUT_FILEPATH, JSON.stringify(bookingOutput, null, 2));

// print all the important variables of the booking to the console (debugging purposes)
function bookingVarsToConsole(_isValid, _startDay, _endDay, _startHour, _endHour, _duration, _rate, _cost) {
  console.log("");
  console.log("* BOOKING SUMMARY *");
  console.log("Booking Validity:", _isValid);
  console.log("Booking Start (Week Day):", _startDay);
  console.log("Booking End (Week Day):", _endDay);
  console.log("Booking Start (Hour):", _startHour);
  console.log("Booking End (Hour):", _endHour);
  console.log("Booking Duration:", _duration, "minutes");
  console.log("Booking Rate:", _rate, "AUD");
  console.log("Booking Cost:", _cost, "AUD");
}