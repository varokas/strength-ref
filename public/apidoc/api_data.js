define({ "api": [
  {
    "type": "get",
    "url": "/bookings",
    "title": "Get all booked tickets",
    "group": "Tickets",
    "description": "<p>This endpoint will be called only one time at the end mainly for validation.</p> <p>It does not have to be performant nor concurrent safe, but this should be representative of all confirmed tickets booked from all the client</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "bookings",
            "description": "<p>List of all bookings groupped by round</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n[\n  \"A1\"\n]",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Tickets",
    "name": "GetBookings",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/bookings"
      }
    ]
  },
  {
    "type": "get",
    "url": "/remaining",
    "title": "Get Remaining Seat(s)",
    "name": "GetRemaining",
    "group": "Tickets",
    "description": "<p>This endpoint should return a list of available seats in the current round</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "seats",
            "description": "<p>List of seat no. (Up to 10 seats)</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"seats\": [\n    \"A1\",\n    \"A2\",\n    ...\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Tickets",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/remaining"
      }
    ]
  },
  {
    "type": "get",
    "url": "/tickets/unconfirmed",
    "title": "Get all unconfirmed ticket",
    "group": "Tickets",
    "description": "<p>This endpoint return unconfirmed ticket.</p>",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "int",
            "optional": false,
            "field": "count",
            "description": "<p>Number of unconfirmed seat</p>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "seat",
            "description": "<p>Unconfirmed seats</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n    count: 1,\n    seats: [ \"A1\" ]\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Tickets",
    "name": "GetTicketsUnconfirmed",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/tickets/unconfirmed"
      }
    ]
  },
  {
    "type": "post",
    "url": "/book",
    "title": "Book the Seat",
    "group": "Tickets",
    "description": "<p>This endpoint required seat no. and will return the ticket if it available, otherwise will return false</p> <p>Rule:</p> <ol> <li>No duplicate tickets (same round, same seat) can be given to any clients</li> <li>All seats in the current round has to be given out first before next round can be open.</li> <li>Seats can be given out in any order that still respect rule (2).</li> </ol>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "seat",
            "description": "<p>The seat no. that user want to reserve.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Status of seat reservation</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "round",
            "description": "<p>Round number for this ticket</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "seat",
            "description": "<p>Seat for this ticket</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "reserve_expired_time",
            "description": "<p>Reservation expired time in timestamp</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"round\": 1,\n  \"seat\": \"A1\",\n  \"reserve_expired_time\": 1527009296459\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"success\": false,\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Tickets",
    "name": "PostBook",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/book"
      }
    ]
  },
  {
    "type": "post",
    "url": "/cancel",
    "title": "Cancel Ticket",
    "group": "Tickets",
    "description": "<p>This endpoint could be called to cancel any confirmed or reserved ticket in the current round and then another user can have that seat</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "seat",
            "description": "<p>The seat no. to cancel</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Status of seat cancellation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Tickets",
    "name": "PostCancel",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/cancel"
      }
    ]
  },
  {
    "type": "post",
    "url": "/confirm",
    "title": "Confirm Ticket",
    "group": "Tickets",
    "description": "<p>This endpoint should be called after /book within period of time to confirm booking</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "seat",
            "description": "<p>The seat no. to confirm</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "success",
            "description": "<p>Status of seat confirmation</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"success\": true\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "./index.js",
    "groupTitle": "Tickets",
    "name": "PostConfirm",
    "sampleRequest": [
      {
        "url": "http://localhost:3000/confirm"
      }
    ]
  }
] });
