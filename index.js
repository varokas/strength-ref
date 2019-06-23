const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const config = require('./config.json')

const book = require('./lib/book')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/**
 * @api {get} /remaining Get Remaining Seat(s)
 * @apiName GetRemaining
 * @apiGroup Tickets
 * @apiDescription This endpoint should return a list of available seats in the current round
 * 
 * @apiSuccess {String[]} seats List of seat no. (Up to 10 seats)
 * @apiSuccess {Number} unconfimedTicketsCount  Number of seat that reserved but not confirmed yet.
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "seats": [
 *        "A1",
 *        "A2",
 *        ...
 *      ],
 *      unconfimedTicketsCount: 2
 *    }
 */
app.get('/remaining', (req, res) => {
    const result = book.getRemaining()
    const unconfirm = book.getUnconfirmed()
    res.json({ seats: result, unconfimedTicketsCount: unconfirm.length })
})

/**
 * @api {post} /book Book the Seat
 * @apiGroup Tickets
 * @apiDescription This endpoint required seat no. and will return the ticket if it available, otherwise will return false
 * 
 * Rule:
 * 1. No duplicate tickets (same seat) can be given to any clients
 * 2. Seats can be given out in any order that still respect rule (2).
 * 
 * @apiParam {String} seat The seat no. that user want to reserve.
 * 
 * @apiSuccess {Boolean} success Status of seat reservation
 * @apiSuccess {String} seat Seat for this ticket
 * @apiSuccess {Number} reserve_expired_time Reservation expired time in timestamp
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true,
 *      "seat": "A1",
 *      "reserve_expired_time": 1527009296459
 *    }
 * @apiErrorExample {json} Error
 *    HTTP/1.1 403 Forbidden
 *    {
 *      "success": false,
 *    }
 */
app.post('/book', (req, res) => {
    const result = book.reserve(req.body.seat)
    if (result.success) {
        res.json(result)
    } else {
        res.status(403).json(result)
    }
})

/**
 * @api {post} /confirm Confirm Ticket
 * @apiGroup Tickets
 * @apiDescription This endpoint should be called after /book within period of time to confirm booking
 * 
 * @apiParam {String} seat The seat no. to confirm
 * 
 * @apiSuccess {Boolean} success Status of seat confirmation
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true
 *    }
 * 
 */
app.post('/confirm', (req, res) => {
    const result = book.confirm(req.body.seat)
    if (result) {
        res.json({ success: result })
    } else {
        res.status(403).json({ success: result })
    }
})

/**
 * @api {post} /cancel Cancel Ticket
 * @apiGroup Tickets
 * @apiDescription This endpoint could be called to cancel any confirmed or reserved ticket for another user can have that seat afterwards
 * 
 * @apiParam {String} seat The seat no. to cancel
 * 
 * @apiSuccess {Boolean} success Status of seat cancellation
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "success": true
 *    }
 * 
 */
app.post('/cancel', (req, res) => {
    const result = book.cancel(req.body.seat)
    if (result) {
        res.json({ success: result })
    } else {
        res.status(403).json({ success: result })
    }
})

/**
 * @api {get} /bookings Get all booked tickets
 * @apiGroup Tickets
 * @apiDescription This endpoint will be called only one time at the end mainly for validation.
 * 
 * It does not have to be performant nor concurrent safe, but this should be 
 * representative of all confirmed tickets booked from all the client
 * 
 * @apiSuccess {String[]} bookings              List of all bookings
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    [
 *      "A1"
 *    ]
 */
app.get('/bookings', (req, res) => {
    res.send(book.getBookings())
})

app.use("/apidoc", express.static("public/apidoc"))

book.init()

app.listen(config.port, () => {  
    console.log(`API Running... @:${config.port}`)
})