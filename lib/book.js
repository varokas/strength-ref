let bookings = []

const bookingStatus = {
    available: 'available',
    reserved: 'reserved',
    confirmed: 'confirmed'
}

const lastRow = 'B'
const lastCol = '5'
const confirmTimeLimit = Number(process.env.CONFIRM_TIME_LIMIT) || 10     // time limit in seconds

let round = 1
let booking
let seats

function init() {
    booking = []
    bookings.push({ 
        round: round,
        seats: booking
    })
    seats = generateSeats()
}

function generateSeats() {
    const seats = {}
    const rowStartChar = 'A'.charCodeAt(0)
    const rowEndChar = lastRow.charCodeAt(0)
    const colStartChar = '1'.charCodeAt(0)
    const colEndChar = lastCol.charCodeAt(0)

    for (let row = rowStartChar; row <= rowEndChar; row += 1) {
        for (let col = colStartChar; col <= colEndChar; col += 1) {
            const seatNo = `${String.fromCharCode(row)}${String.fromCharCode(col)}`
            seats[seatNo] = {
                status: bookingStatus.available,
                reservedExpiredTime: null,
            }
        }
    }
    return seats
}

function reserveSeat(seatNo) {
    seats[seatNo].status = bookingStatus.reserved
    seats[seatNo].reservedExpiredTime = Number(new Date()) + (confirmTimeLimit * 1000) // store in timestamp format
}

function cancelSeat(seatNo) {
    seats[seatNo] = {
        status: bookingStatus.available,
        reservedExpiredTime: null,
    }
}

function confirmSeat(seatNo) {
    delete seats[seatNo]

    booking.push(seatNo)

    if (Object.keys(seats).length === 0) {
        // start new round
        round += 1
        init()
    }
}

module.exports.init = () => (init())
module.exports.dispose = () => {
    bookings = []
    seats = null
}

module.exports.getRemaining = (noOfSeats) => {
    const _seats = []
    const now = Number(new Date())
    const seatNos = Object.keys(seats)
    if (isNaN(Number(noOfSeats))) noOfSeats = seatNos.length
    for (let i = 0; i < seatNos.length; i += 1) {
        const seat = seats[seatNos[i]]
        if (seat.status === bookingStatus.available ||
            (
                seat.status === bookingStatus.reserved &&
                now >= seat.reservedExpiredTime
            )
        ) {
            _seats.push(seatNos[i])
        }
        if (_seats.length >= noOfSeats) {
            break
        }
    }
    return _seats
}

module.exports.reserve = (seatNo) => {
    const now = Number(new Date())
    if (
        seatNo in seats && 
        seats[seatNo].status === bookingStatus.available
    ) {
        // seat valid and available
    } else if (
        seatNo in seats && 
        seats[seatNo].status === bookingStatus.reserved &&
        now >= seats[seatNo].reservedExpiredTime
    ) {
        // reserve expire
    } else {
        // seatNo not valid or not available
        // let get an available seat for user
        const seatNos = Object.keys(seats)
        for (let i = 0; i < seatNos.length; i += 1) {
            const seat = seats[seatNos[i]]
            if (seat.status === bookingStatus.available || 
                (
                    seat.status === bookingStatus.reserved &&
                    now >= seat.reservedExpiredTime
                )
            ) {
                seatNo = seatNos[i]
                break
            }
        }
    }
    if (!(seatNo in seats)) {
        return {
            success: false,
            error: 'no seat available'
        }
    }

    // reserve seat for user
    reserveSeat(seatNo)

    return {
        success: true,
        round: round,
        seat: seatNo,
        reserve_expired_time: seats[seatNo].reservedExpiredTime
    }
}

module.exports.confirm = (seatNo) => {
    const now = Number(new Date())
    if (
        seatNo in seats && 
        seats[seatNo].status === bookingStatus.reserved &&
        now <= seats[seatNo].reservedExpiredTime
    ) {
        confirmSeat(seatNo)
        return true
    }
    return false
}

module.exports.cancel = (seatNo) => {
    // cancel confirmed
    for (let i = 0; i < booking.length; i += 1) {
        const _no = booking[i]
        if (seatNo === _no) {
            booking.splice(i, 1)
            cancelSeat(seatNo)
            return true
        }
    }
    // cancel reserve
    if (
        seatNo in seats && 
        seats[seatNo].status === bookingStatus.reserved
    ) {
        seats[seatNo].status = bookingStatus.available
        return true
    }

    return false
}

module.exports.getBookings = () => {
    return bookings
}
