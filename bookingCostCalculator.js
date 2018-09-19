// path consts
const INPUT_FILEPATH = "input.json";
const OUTPUT_FILEPATH = "output.json";
const BOOKINGRULES_FILEPATH = "bookingRules.json";
const BOOKINGRATES_FILEPATH = "bookingRates.json";
// load filesystem module
var fs = require('fs');
// check and load configuration files
checkConfigFilesExist(INPUT_FILEPATH, BOOKINGRULES_FILEPATH, BOOKINGRATES_FILEPATH);
var bookingInput = loadConfigFile(INPUT_FILEPATH);
var bookingRules = loadConfigFile(BOOKINGRULES_FILEPATH);
var bookingRates = loadConfigFile(BOOKINGRATES_FILEPATH);
// booking rules consts
const DAY_RATE_START_HOUR = bookingRules.dayRateStartHour;
const DAY_RATE_END_HOUR = bookingRules.dayRateEndHour;
const MIN_BOOKING_MINUTES = bookingRules.minBookingMinutes;
const MAX_BOOKING_MINUTES = bookingRules.maxBookingMinutes;
const MIN_BOOKING_INCREMENT_MINUTES = bookingRules.minBookingIncrementMinutes;
const RATE_UNIT_TIME_MINUTES = bookingRules.rateUnitTimeMinutes;
const NUMBER_OF_INCREMENTS_IN_UNIT_TIME = RATE_UNIT_TIME_MINUTES / MIN_BOOKING_INCREMENT_MINUTES;
// object to output to file
var bookingOutput = [];
// cycle through each booking
bookingInput.forEach(booking => {
  // booking variables
  let id, isValid, rate, cost, duration, startDay, endDay, startHour, endHour;
  id = booking.id;
  let bookingStart = new Date(booking.from);
  let bookingEnd = new Date(booking.to);
  duration = calculateBookingDuration(bookingStart, bookingEnd);
  isValid = validateBookingDuration(duration, MIN_BOOKING_MINUTES, MAX_BOOKING_MINUTES);

  if (isValid) {
    startDay = bookingStart.getDay();
    startHour = bookingStart.getHours();
    endDay = bookingEnd.getDay();
    endHour = bookingEnd.getHours();
    rate = checkAndApplyBookingRate(startDay, startHour, endDay, endHour, DAY_RATE_START_HOUR, DAY_RATE_END_HOUR);
    cost = calculateBookingCost(rate, duration, NUMBER_OF_INCREMENTS_IN_UNIT_TIME, MIN_BOOKING_INCREMENT_MINUTES);
  } else {
    cost = 0;
  }
  addNewBookingOutputEntry(id, bookingStart, bookingEnd, isValid, cost);
  // uncomment the following line if you need to debug any booking variable before writing to file
  // printBookingVarsToConsole(id, isValid, startDay, endDay, startHour, endHour, duration, rate, cost);
});
createFile(OUTPUT_FILEPATH, bookingOutput);

// ###################
// FUNCTION DEFINITONS
// ###################
// check if all necessary config files exist
function checkConfigFilesExist(_inputFilePath, _bookingRulesFilePath, _bookingRatesFilePath) {
  checkFileExists(_inputFilePath);
  checkFileExists(_bookingRulesFilePath);
  checkFileExists(_bookingRatesFilePath);
}
// check if specific file exists
function checkFileExists(_filePath) {
  return fs.existsSync(_filePath) ? true : throwError("MISSING FILE: ", _filePath);
}
// custom error throwing message
function throwError(_message, _variable) {
  // _message is a string while gives meaning to error in question > eg: "Missing File: "
  // _variable is the value of the variable which triggered the error > eg: myFilePathVariable
  throw new Error(_message + _variable);
}
// load configuration file
function loadConfigFile(_filePath) {
  return JSON.parse(fs.readFileSync(_filePath, 'utf8'));
}
// calculate the duration of the booking in a certain time unit
function calculateBookingDuration(_bookingStart, _bookingEnd) {
  let milliseconds = _bookingEnd - _bookingStart;
  let minutes = milliseconds / 1000 / 60;
  return parseInt(minutes);
}
// validate if the booking fits within the minimum and maximum booking duration values
function validateBookingDuration(_duration, _minimumBookingDuration_inMinutes, _maximumBookingDuration_inMinutes) {
  return (duration >= _minimumBookingDuration_inMinutes && duration <= _maximumBookingDuration_inMinutes);
}
function checkAndApplyBookingRate(_startDay, _startHour, _endDay, _endHour, _dayRateStartHour, _dayRateEndHour) {
  return areBookingHoursNightHours(_startHour, _endHour, _dayRateStartHour, _dayRateEndHour) ?
    applyNightRate(_startDay, _endDay) : applyDayRate(_startDay, _endDay);
}
function areBookingHoursNightHours(_startHour, _endHour, _dayRateStartHour, _dayRateEndHour) {
  return (Math.min(_startHour, _endHour) <= _dayRateStartHour ||
    Math.max(_startHour, _endHour) >= _dayRateEndHour);
}
function applyNightRate(_startDay, _endDay) {
  return Math.max(bookingRates[_startDay].nightRate, bookingRates[_endDay].nightRate);
}
function applyDayRate(_startDay, _endDay) {
  return Math.max(bookingRates[_startDay].dayRate, bookingRates[_endDay].dayRate);
}
function calculateBookingCost(_rate, _duration, _numberOfIncrementsInUnitTime, _minBookingIncrementMinutes) {
  let incrementCost = _rate / _numberOfIncrementsInUnitTime;
  let numberOfIncrements = _duration / _minBookingIncrementMinutes;
  let totalCostByIncrements = incrementCost * numberOfIncrements;
  return roundDown_twoDecimals(totalCostByIncrements);
}

function roundDown_twoDecimals(_numberToRoundDown) {
  return Math.floor((_numberToRoundDown) * 100) / 100;
}
// update booking data to be outputted with a new entry
function addNewBookingOutputEntry(_id, _bookingStart, _bookingEnd, _isValid, _cost) {
  bookingOutput.push({
    id: _id,
    from: _bookingStart,
    to: _bookingEnd,
    isValid: _isValid,
    total: _cost
  });
}
// create a file
function createFile(_filePath, _data) {
  // data prep and 'prettifying' JSON file
  _data = JSON.stringify(_data, null, 2);
  // for readability and then writing onto the output file
  fs.writeFileSync(_filePath, _data);
}

// ###############
// DEBUG FUNCTIONS
// ###############
// print all the important variables of the booking to the console (debugging purposes)
function printBookingVarsToConsole(_id, _isValid, _startDay, _endDay, _startHour, _endHour, _duration, _rate, _cost) {
  console.log("");
  console.log("* BOOKING SUMMARY *");
  console.log("Booking ID:", _id);
  console.log("Booking Validity:", _isValid);
  console.log("Booking Start (Week Day):", _startDay);
  console.log("Booking End (Week Day):", _endDay);
  console.log("Booking Start (Hour):", _startHour);
  console.log("Booking End (Hour):", _endHour);
  console.log("Booking Duration:", _duration, "minutes");
  console.log("Booking Rate:", _rate, "AUD");
  console.log("Booking Cost:", _cost, "AUD");
}