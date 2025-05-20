import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import PaginatedTable from '../../components/PaginatedTable'
import { FaPlus, FaSearch, FaEdit, FaTrash, FaCopy } from 'react-icons/fa'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { user } = useUserAuth()
  const [parkings, setParkings] = useState([])
  const [loading, setLoading] = useState(false)
  const [openAddParkingModal, setOpenAddParkingModal] = useState(false)
  const [selectedParking, setSelectedParking] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [searchLocation, setSearchLocation] = useState('')
  const navigate = useNavigate()

  const fetchParkings = async (location = '') => {
    if (loading) return
    setLoading(true)

    try {
      const response = await axiosInstance.get(
        location ? `${API_PATHS.PARKINGS.SEARCH}?location=${location}` : API_PATHS.PARKINGS.GET_ALL
      )
      if (response.data) {
        setParkings(response.data)
      }
    } catch (error) {
      console.error('Something went wrong:', error)
      toast.error('Failed to fetch parking data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchParkings()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchParkings(searchLocation)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking?')) {
      setDeletingId(id)
      try {
        await axiosInstance.delete(API_PATHS.PARKINGS.DELETE(id))
        toast.success('Parking deleted successfully')
        setParkings(parkings.filter(parking => parking.id !== id))
      } catch (error) {
        console.error('Error deleting parking:', error)
        const errorMessage = error.response?.data?.message || 'Failed to delete parking'
        toast.error(errorMessage)
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleUpdate = (parking) => {
    setSelectedParking(parking)
    setOpenAddParkingModal(true)
  }

  const handleAddParking = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const parkingData = {
      code: formData.get('code'),
      parkingName: formData.get('parkingName'),
      availableSpaces: parseInt(formData.get('availableSpaces')),
      location: formData.get('location'),
      chargingFeePerHour: parseFloat(formData.get('chargingFeePerHour'))
    }

    try {
      if (selectedParking?.id) {
        // Update existing parking
        await axiosInstance.patch(
          API_PATHS.PARKINGS.UPDATE(selectedParking.id),
          parkingData
        )
        toast.success('Parking updated successfully')
      } else {
        // Add new parking
        await axiosInstance.post(API_PATHS.PARKINGS.ADD, parkingData)
        toast.success('Parking added successfully')
      }
      setOpenAddParkingModal(false)
      setSelectedParking(null)
      fetchParkings()
    } catch (error) {
      console.error('Error saving parking:', error)
      const errorMessage = error.response?.data?.message || 'Failed to save parking'
      toast.error(errorMessage)
    }
  }

  const closeModal = () => {
    setOpenAddParkingModal(false)
    setSelectedParking(null)
  }

  // Define table columns
  const columns = [
    { header: 'Code', accessor: 'code' },
    { header: 'Parking Name', accessor: 'parkingName' },
    { header: 'Available Spaces', accessor: 'availableSpaces' },
    { header: 'Location', accessor: 'location' },
    { header: 'Fee/Hour', accessor: 'chargingFeePerHour' },
  ]

  // Add this function to render custom actions based on user role
  const renderActions = (row) => {
    if (user?.role === 'admin') {
      return (
        <div className="flex space-x-2">
          <button
            onClick={() => handleUpdate(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            disabled={deletingId === row.id}
            className={`p-1 ${
              deletingId === row.id
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-red-600 hover:text-red-800'
            }`}
            title={deletingId === row.id ? 'Deleting...' : 'Delete'}
          >
            <FaTrash size={18} />
          </button>
        </div>
      )
    } else {
      return (
        <button
          onClick={() => {
            navigator.clipboard.writeText(row.code)
            toast.success('Parking code copied to clipboard!')
          }}
          className="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          title="Copy parking code"
        >
          <FaCopy size={14} /> Copy Code
        </button>
      )
    }
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Parking Management</h1>
          {user?.role === 'admin' && (
            <button
              onClick={() => setOpenAddParkingModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Add Parking
            </button>
          )}
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by location..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaSearch />
            </button>
          </div>
        </form>

        {/* Updated Parking Table */}
        <PaginatedTable
          columns={columns}
          data={parkings}
          renderActions={renderActions}
          deletingId={deletingId}
        />

        {/* Add/Edit Parking Modal */}
        {openAddParkingModal && (
          <Modal
            isOpen={openAddParkingModal}
            onClose={closeModal}
            title={selectedParking ? 'Edit Parking' : 'Add New Parking'}
          >
            <form onSubmit={handleAddParking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Code</label>
                <input
                  type="text"
                  name="code"
                  defaultValue={selectedParking?.code}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parking Name</label>
                <input
                  type="text"
                  name="parkingName"
                  defaultValue={selectedParking?.parkingName}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Available Spaces</label>
                <input
                  type="number"
                  name="availableSpaces"
                  defaultValue={selectedParking?.availableSpaces}
                  required
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={selectedParking?.location}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Charging Fee per Hour</label>
                <input
                  type="number"
                  name="chargingFeePerHour"
                  defaultValue={selectedParking?.chargingFeePerHour}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {selectedParking ? 'Update' : 'Add'} Parking
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Home
