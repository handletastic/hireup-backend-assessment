# Hugo Santos' HireUp Backend Assessment Solution

This repo is my submission to the [Backend Assessment](https://github.com/hireupau/backend-assessment) by [HireUp](https://hireup.com.au).

## Overview

The purpose of this application is to serve as a calculator for the cost of HireUp bookings.
A booking is the time worked by a support worker with a user.

## Setup

You must have installed:

- [Node.js](https://nodejs.org/)
- [fs node package](https://www.npmjs.com/package/fs)

## Requirements

The application requires:

- a JSON file named [input.json](./input.json) which contains all the bookings to which you want to calculate the cost for and it's validity
- a JSON file named [bookingRules.json](./bookingRules.json) which contains the business rules for calculating the booking costs and their validity
- a JSON file name [bookingRates.json](./bookingRates.json) which contains the booking rates for calculating the booking costs

## To Run

1. Open your terminal application.
2. Navigate to the directory 'hireup-backend-assessment'
3. Run the command `node bookingCostCalculator.js`
4. Open the new file 'output.json' on a browser or a text editor to see the costs and validity flags for each booking.
5. That's all folks!

### Note

This application was developed with the intent to simply write an output file therefore it was unnecessary to make it run on a browser with a live server. However, if you want to view this application on your browser you'll require to:

1. Do the steps above on the 'To Run' title
2. Install [live-server](https://www.npmjs.com/package/live-server) node package.
3. Navigate to the directory 'hireup-backend-assessment'
4. Run the command `live-server` from your terminal (this should automatically open the file 'index.html' on your browser)
5. You can now view it from your browser as if the file was being requested from a server

## On Run

The application creates a file called output.json containing the array of booking objects with total cost of the booking and an isValid flag whenever a booking breaks one of the business rules, the total is set to 0 and the isValid flag gets marked false.

## File Explanation

### input.json

This is an example of an entry on [input.json](./input.json).

```json
[
  {
    "id": 1,
    "from": "2017-10-23T08:00:00+11:00",
    "to": "2017-10-23T11:00:00+11:00"
  }
]
```

### output.json

This is an example of an entry which will be created on the output file upon running the application.

```json
[
  {
    "id": 1,
    "from": "2017-10-23T08:00:00+11:00",
    "to": "2017-10-23T11:00:00+11:00",
    "isValid": true,
    "total": 114
  }
]
```

## Debugging

The pseudo-debugging function "bookingVarsToConsole" isn't necessary for the application to work. Feel free to remove it at your will.

## Thank you

Any questions please contact me on hdsantos89@gmail.com