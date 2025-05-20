import React from 'react'

const TicketCard = ({ ticket, onPay, payingId }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border ${
      ticket.status === 'paid' ? 'border-green-500' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-800">
            Bill #{ticket.id}
          </h4>
          <p className="text-sm text-gray-600">{ticket.parkingName}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-semibold rounded ${
          ticket.status === 'paid' 
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {ticket.status === 'paid' ? 'Paid' : 'Unpaid'}
        </span>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm">
          <span className="font-medium">Plate Number:</span> {ticket.plateNumber}
        </p>
        <p className="text-sm">
          <span className="font-medium">Entry Time:</span>{' '}
          {new Date(ticket.entryDateTime).toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="font-medium">Exit Time:</span>{' '}
          {new Date(ticket.exitDateTime).toLocaleString()}
        </p>
        <p className="text-sm">
          <span className="font-medium">Amount:</span> ${ticket.chargedAmount}
        </p>
      </div>

      {ticket.status === 'unpaid' && (
        <button
          onClick={() => onPay(ticket.id)}
          disabled={payingId === ticket.id}
          className={`w-full mt-4 py-2 px-4 rounded-md text-white font-medium transition-colors ${
            payingId === ticket.id
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {payingId === ticket.id ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Pay Now'}
        </button>
      )}
    </div>
  )
}

export default TicketCard