# Bear Strength Reference Implementation
[![Build Status](https://travis-ci.org/bigbearsio/strength-ref.svg?branch=master)](https://travis-ci.org/bigbearsio/strength-ref)

From this project: https://github.com/bigbearsio/strength

A reference implementation of expected functional behavior of the service. 

This is neither performant nor thead safe but it should serve as a documentation of how the service is expected to behave. 

## Prerequisite
* NodeJS

## Usage Flow
This is how each client should use the API. 

A client should represent a single user trying to get 1 ticket. They will retry until that one ticket is got (assume all seats are the same to the person). Once they got the ticket or they found out that the tickets are all gone, they will quit

1. Call to `/remaining` to get top 10 remaining tickets. 
   * This returns `(availableTickets,numberOfUnconfirmedTickets)`
   * `case availableTickets == [] && numberOfUnconfirmedTickets == 0` -> Quit
   * `case availableTickets == [] && numberOfUnconfirmedTickets > 0` -> retry this step 
2. Pick one of the tickets from `availableTickets` and call `/book`
   * If fail go to (1)
3. call `/confirm` on the same ticket
   * If fail go to (1)
   * If success quit

## Running
* Clone the project
* `npm install` or `yarn`
* `npm start` or `yarn start`
* Browse to `http://localhost:3000/apidoc`

![Screenshot](public/images/doc-screenshot.png)

## Pushing Code
Run API Doc first before pushing code to repo
```npm run apidoc```
