import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PaginatedTable from '../../components/PaginatedTable'
import { FaPlus, FaEdit, FaTrash, FaTicketAlt, FaSignOutAlt } from 'react-icons/fa'
import Modal from '../../components/Modal'
import AddRegistrationForm from '../../components/RegisterCar/AddRegistrationForm'
import TicketCard from '../../components/RegisterCar/TicketCard'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const RegisterCar = () => {
  const { user, isLoading } = useUserAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  

  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(false)
  const [openAddModal, setOpenAddModal] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [tickets, setTickets] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchRegistrations = async () => {
    if (loading) return
    setLoading(true)

    try {
      const endpoint = isAdmin ? API_PATHS.REGISTER_CARS.GET_ALL : API_PATHS.REGISTER_CARS.GET_USER_REGISTRATIONS
      const response = await axiosInstance.get(endpoint)
      setRegistrations(response.data)

      // For regular users, fetch tickets for each registration
      if (!isAdmin) {
        const ticketPromises = response.data
          .filter(reg => reg.ticketStatus)
          .map(reg => axiosInstance.get(API_PATHS.REGISTER_CARS.GET_TICKET(reg.id)))
        
        const ticketResponses = await Promise.all(ticketPromises)
        setTickets(ticketResponses.map(res => res.data))
      }
    } catch (error) {
      console.error('Error fetching registrations:', error)
      toast.error('Failed to fetch registrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isLoading && user) {
      fetchRegistrations()
    }
  }, [user, isLoading])

  const handleAddRegistration = async (formData) => {
    try {
      if (selectedRegistration) {
        // Update existing registration
        await axiosInstance.patch(
          API_PATHS.REGISTER_CARS.UPDATE(selectedRegistration.id),
          formData
        )
        toast.success('Registration updated successfully')
      } else {
        // Create new registration
        await axiosInstance.post(API_PATHS.REGISTER_CARS.CREATE, formData)
        toast.success('Car registered successfully')
      }
      setOpenAddModal(false)
      setSelectedRegistration(null)
      fetchRegistrations()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process registration')
    }
  }

  const handleUpdate = (id) => {
    const registration = registrations.find(reg => reg.id === id)
    if (registration) {
      setSelectedRegistration(registration)
      setOpenAddModal(true)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this registration?')) {
      setDeletingId(id)
      try {
        await axiosInstance.delete(API_PATHS.REGISTER_CARS.DELETE(id))
        toast.success('Registration deleted successfully')
        fetchRegistrations()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete registration')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleGenerateTicket = async (id) => {
    try {
      await axiosInstance.patch(API_PATHS.REGISTER_CARS.UPDATE_TICKET_STATUS(id))
      toast.success('Ticket generated successfully')
      fetchRegistrations()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate ticket')
    }
  }

  const handleProcessExit = async (id) => {
    try {
      await axiosInstance.patch(API_PATHS.REGISTER_CARS.PROCESS_EXIT(id))
      toast.success('Exit processed successfully')
      fetchRegistrations()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process exit')
    }
  }

  const handleGenerateBill = async (id) => {
    try {
      await axiosInstance.post(API_PATHS.REGISTER_CARS.GENERATE_BILL(id))
      toast.success('Bill generated successfully')
      fetchRegistrations()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate bill')
    }
  }

  // Define table columns based on user role
  const columns = [
    ...(isAdmin ? [
      { header: 'User', accessor: 'user' },
    ] : []),
    { header: 'Plate Number', accessor: 'plateNumber' },
    { header: 'Parking', accessor: 'parking' },
    { header: 'Entry Time', accessor: 'entryDateTime' },
    { header: 'Status', accessor: 'status' },
    { header: 'Ticket Status', accessor: 'ticketStatus' },
    { header: 'Slot', accessor: 'slot' },
  ]

  // Filter registrations based on status
  const filteredRegistrations = registrations.filter(reg => {
    if (statusFilter === 'all') return true
    return reg.status === statusFilter
  })

  // Format data for table using filtered registrations
  const tableData = filteredRegistrations.map(reg => ({
    ...reg,
    id: reg.id,
    entryDateTime: new Date(reg.entryDateTime).toLocaleString(),
    parking: reg.parking ? `${reg.parking.parkingName} (${reg.parking.location})` : 'N/A',
    ticketStatus: reg.ticketStatus ? 'Generated' : 'Pending',
    slot: reg.slot || <span className="text-gray-400">N/A</span>,
    ...(isAdmin && reg.user ? {
      user: `${reg.user.fullName}`
    } : {})
  }))

  // Custom actions renderer
  const renderActions = (row) => {
    if (isAdmin) {
      return (
        <div className="flex space-x-2">
          {row.ticketStatus === 'Pending' && row.status === 'ingoing' && (
            <button
              onClick={() => handleGenerateTicket(row.id)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              title="Generate Ticket"
            >
              Generate Ticket
            </button>
          )}
          {row.ticketStatus === 'Generated' && row.status === 'outgoing' && (
            <button
              onClick={() => handleGenerateBill(row.id)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              title="Generate Bill"
            >
              Generate Bill
            </button>
          )}
        </div>
      )
    } else {
      return (
        <div className="flex space-x-2">
          {row.ticketStatus === 'Pending' && (
            <button
              onClick={() => handleUpdate(row.id)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="Edit"
            >
              <FaEdit size={18} />
            </button>
          )}
          {row.ticketStatus === 'Pending' && (
            <button
              onClick={() => handleDelete(row.id)}
              disabled={deletingId === row.id}
              className={`p-1 ${
                deletingId === row.id
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-800'
              }`}
              title="Delete"
            >
              <FaTrash size={18} />
            </button>
          )}
          {row.ticketStatus === 'Generated' && row.status === 'ingoing' && (
            <button
              onClick={() => handleProcessExit(row.id)}
              className="p-1 text-green-600 hover:text-green-800"
              title="Process Exit"
            >
              <FaSignOutAlt size={18} />
            </button>
          )}
        </div>
      )
    }
  }

  return (
    <DashboardLayout activeMenu="RegisterCar">
      <div className="my-5 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isAdmin ? 'All Car Registrations' : 'My Car Registrations'}
          </h2>
          {!isAdmin && (
            <button
              onClick={() => setOpenAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus /> Register Car
            </button>
          )}
        </div>

        {/* Add filter controls for admin */}
        {isAdmin && (
          <div className="mb-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="ingoing">Car Entry</option>
              <option value="outgoing">Car Exit</option>
            </select>
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading registrations...</p>
        ) : (
          <>
            <PaginatedTable 
              columns={columns} 
              data={tableData} 
              rowsPerPage={5}
              renderActions={renderActions}
            />

            {/* Display tickets for regular users */}
            {!isAdmin && tickets.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Active Tickets</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Modal
          isOpen={openAddModal}
          onClose={() => {
            setOpenAddModal(false)
            setSelectedRegistration(null)
          }}
          title={selectedRegistration ? 'Update Registration' : 'Register Car'}
        >
          <AddRegistrationForm
            onSubmit={handleAddRegistration}
            initialData={selectedRegistration}
          />
        </Modal>
      </div>
    </DashboardLayout>
  )
}

export default RegisterCar 