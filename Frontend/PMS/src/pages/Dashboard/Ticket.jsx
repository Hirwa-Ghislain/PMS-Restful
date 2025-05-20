import React, { useState, useEffect, useContext } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import { UserContext } from '../../context/UserContext'
import { FaDownload } from 'react-icons/fa'

const Ticket = () => {
  useUserAuth()
  const { user } = useContext(UserContext)
  const isAdmin = user?.role === 'admin'
  
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(false)
  const [payingId, setPayingId] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'paid', 'unpaid'

  const fetchBills = async () => {
    if (loading || !user) return
    setLoading(true)

    try {
      const response = await axiosInstance.get(API_PATHS.BILLS.GET_USER_BILLS)
      if (response.data) {
        setBills(response.data)
      }
    } catch (error) {
      console.error('Error fetching bills:', error)
      toast.error('Failed to fetch bills')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchBills()
    }
  }, [user])

  const handlePay = async (id) => {
    if (!user) return
    setPayingId(id)
    try {
      await axiosInstance.patch(API_PATHS.BILLS.PAY_BILL(id))
      toast.success('Bill paid successfully')
      fetchBills() // Refresh the data
    } catch (error) {
      console.error('Error paying bill:', error)
      toast.error('Failed to pay bill')
    } finally {
      setPayingId(null)
    }
  }

  const filteredBills = bills.filter(bill => {
    if (filter === 'all') return true
    return filter === 'paid' ? bill.status === 'paid' : bill.status === 'unpaid'
  })

  if (!user) {
    return (
      <DashboardLayout activeMenu="Bills">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout activeMenu="Bills">
      <div className="my-5 mx-auto max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Bills</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('paid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilter('unpaid')}
              className={`px-4 py-2 rounded-md transition-colors ${
                filter === 'unpaid'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unpaid
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBills.length === 0 ? (
              <div className="col-span-full flex flex-col justify-center items-center h-64 text-center">
                <p className="text-gray-500 text-lg mb-2">No bills found</p>
                <p className="text-gray-400 text-sm">Try changing the filter or check back later</p>
              </div>
            ) : (
              filteredBills.map((bill) => (
                <div 
                  key={bill.id} 
                  className={`bg-white rounded-lg shadow-md p-6 ${
                    bill.status === 'paid' ? 'border-2 border-green-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Bill #{bill.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Parking: {bill.parkingName}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      bill.status === 'paid' 
                        ? 'text-green-600 bg-green-100'
                        : 'text-red-600 bg-red-100'
                    }`}>
                      {bill.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Entry Time:</span> {new Date(bill.entryDateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Exit Time:</span> {new Date(bill.exitDateTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {bill.duration} hours
                    </p>
                    <p className="text-lg font-semibold text-gray-800 mt-2">
                      Amount: ${bill.amount}
                    </p>
                  </div>

                  {bill.status === 'unpaid' ? (
                    <button
                      onClick={() => handlePay(bill.id)}
                      disabled={payingId === bill.id}
                      className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                        payingId === bill.id
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {payingId === bill.id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : 'Pay Now'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 px-4 rounded-md text-white font-medium bg-gray-400 cursor-not-allowed"
                    >
                      Paid
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Ticket