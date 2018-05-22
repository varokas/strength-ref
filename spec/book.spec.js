const expect = require('chai').expect

process.env.CONFIRM_TIME_LIMIT = '0.5'
const book = require('../lib/book')

describe('book module', function () {
    this.timeout(2000)

    beforeEach(() => {
        book.init()
    })

    afterEach(() => {
        book.dispose()
    })

    it('can get the remaining seats', () => {
        const seats = book.getRemaining()
        expect(seats.length).to.be.equal(10)
    })

    it('can get only 1 remaining seat', () => {
        const seats = book.getRemaining(1)
        expect(seats.length).to.be.equal(1)
    })

    it('should successfully reserve a seat', () => {
        const seat = book.reserve('A1')

        expect(seat).to.has.property('seat')
        expect(seat).to.has.property('round')
    })

    it('should not reserve the same seat', () => {
        const seat1 = book.reserve('A1')
        const seat2 = book.reserve('A1')

        expect(seat1).to.has.property('seat')
        expect(seat2).to.has.property('seat')
        expect(seat1.seat).to.be.not.eql(seat2.seat)
    })

    it('can get all bookings', () => {
        const seat = book.reserve()
        book.confirm(seat.seat)
        const bookings = book.getBookings()
        expect(bookings).to.be.an('array')
        expect(bookings).to.has.length(1)
        expect(bookings[0]).to.has.property('seats')
        expect(bookings[0].seats).to.be.eql([seat.seat])
    })

    it('can cancel reserved and confirmed seat', () => {
        let seat = book.reserve()
        expect(book.cancel(seat.seat)).to.be.true

        seat = book.reserve()
        book.confirm(seat.seat)
        expect(book.cancel(seat.seat)).to.be.true
        
        const bookings = book.getBookings()
        expect(bookings).to.be.an('array')
        expect(bookings).to.has.length(1)
        expect(bookings[0]).to.has.property('seats')
        expect(bookings[0].seats).to.be.eql([])
    })

    it('should go to next round when no seat available', () => {
        const seats = book.getRemaining()
        const result = []
        for (let i = 0; i < seats.length; i += 1) {
            const seatNo = seats[i]
            const seat = book.reserve(seatNo)
            expect(book.confirm(seat.seat)).to.be.true
            result.push(seat)
        }
        const newRoundSeat = book.reserve()
        expect(newRoundSeat).to.has.property('round')
        expect(newRoundSeat.round).to.not.equal(result[0].round)
        expect(book.getBookings().length).to.equal(2)
    })

    it('should cancel seat', () => {
        let seats = book.getRemaining()
        let cancelSeatNo = 'B3'
        const result = []
        for (let i = 0; i < seats.length-1; i += 1) {
            const seatNo = seats[i]
            const seat = book.reserve(seatNo)
            expect(book.confirm(seat.seat)).to.be.true
            result.push(seat)
        }
        seats = book.getRemaining()
        expect(book.cancel(cancelSeatNo)).to.be.true
        seats = book.getRemaining()
        expect(book.cancel(cancelSeatNo)).to.be.false
        const s = book.reserve(cancelSeatNo)
        expect(book.confirm(s.seat)).to.be.true
    })

    it('should cannot confirm after reserve expire and that seat become available', (done) => {
        const seatNo = 'A1'
        let seats = book.getRemaining()
        const maxSeats = seats.length
        let seat = book.reserve(seatNo)
        seats = book.getRemaining()
        expect(seats.length).to.equal(maxSeats-1)
        setTimeout(() => {
            const result = book.confirm(seat.seat)
            expect(result).to.be.false
            seats = book.getRemaining()
            expect(seats.length).to.equal(maxSeats)
            seat = book.reserve(seatNo)
            expect(seat.seat).to.eql(seatNo)
            done()
        }, 600)
    })
})