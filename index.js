const express = require('express');  
const app = express();

// const rows = 1..100
// const cols = 'A'..'Z'



const lastRow = 'B'
const lastCol = '5'

var currentRow = 'A'
var currentCol = '1'
var currentRound = 1

var bookings = []
bookings.push({"round": currentRound, "seats": []})

/**
 * @api {post} /book Book any seat in the current round
 * @apiGroup Tickets
 * @apiDescription This endpoint should return a ticket which can be any seat in the current round
 * 
 * Rule:
 * 1. No duplicate tickets (same round, same seat) can be given to any clients
 * 2. All seats in the current round has to be given out first before next round can be open.
 * 3. Seats can be given out in any order that still respect rule (2).
 * 
 * @apiSuccess {Number} round Round number for this ticket
 * @apiSuccess {String} seat Seat for this ticket
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "round": 1,
 *      "seat": "E3",
 *    }
 */
app.post('/book', function(req, res) {  
    const seat = currentRow + currentCol

    res.send({"round": currentRound, "seat": seat})

    bookings[bookings.length - 1].seats.push(seat)

    currentCol++
    if (currentCol > lastCol) {
        currentCol = 1
        currentRow = String.fromCharCode(currentRow.charCodeAt() + 1);

        if (currentRow > lastRow) {
            currentRow = 'A'

            currentRound++;
            bookings.push({"round": currentRound, "seats": []})
        }
    }
});

/**
 * @api {get} /bookings Get all booked tickets
 * @apiGroup Tickets
 * @apiDescription This endpoint will be called only one time at the end mainly for validation.
 * 
 * It does not have to be performant nor concurrent safe, but this should be 
 * representative of all confirmed tickets booked from all the client
 * 
 * @apiSuccess {Object[]} bookings              List of all bookings groupped by round
 * @apiSuccess {Number}   bookings.round        Round number
 * @apiSuccess {String[]} bookings.seats        Seats in current round
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [
 *      { "round": 1, "seats": ["A2","A3","A4"] }
 *      { "round": 2, "seats": ["A2","A3","A4"] }
 *    ]
 */
app.get('/bookings', function(req, res) {  
    res.send(bookings)
});

app.use("/apidoc", express.static("public/apidoc"))

app.listen(3000, function() {  
    console.log('API Running...');
});