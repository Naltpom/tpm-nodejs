const jwt = require('jsonwebtoken');
const TicketModel = require('../models/ticket.model');
const TicketIncidentWebModel = require('../models/schemas-ticket/ticket-incident-web.model');
const TicketNewsModel = require('../models/schemas-ticket/ticket-news.model');
const TicketSuggModel = require('../models/schemas-ticket/ticket-suggestion.model');
const FileModel = require('../models/file.model');



/**
 * ticket.controller.getAllTickets()
 */
 exports.getAllTickets = (req, res, next) => {
    TicketModel
        .find()
        .then( ticket => {
            return res.status(200).json({ticket});
        })
        .catch(err => res.status(400).json({ message: 'Error when getting tickets.', error: err }))
}

/**
 * ticket.controller.getOneTicket()
 */
 exports.getOneTicket = (req, res, next) => {
    const getTicketPromise = TicketModel
        .findOne({ _id: req.params.id })
        .then(ticket => ticket)
        .catch(err => err)

    Promise.all([getTicketPromise])
        .then(data => {
            const schemaTicketName = data.schema_ticket_name
            const schemaTicketId = data.schema_ticket_id
            
            const ticketData = []
            if ('ticket-incident-web' === schemaTicketName) {
                ticketData = TicketIncidentWebModel.findOne({ _id: schemaTicketId })
            } else if ('ticket-news' === schemaTicketName) {
                ticketData = TicketNewsModel.findOne({ _id: schemaTicketId })
            } else if ('ticket-suggestion' === schemaTicketName) {
                ticketData = ticketSuggestionModel.findOne({ _id: schemaTicketId })
            }

            Promise.all([ticketData])
                .then(ticketData = res.status(200).json({data, ticketData}))

        })
        .catch(error => res.status(400).json({error: error}))
}