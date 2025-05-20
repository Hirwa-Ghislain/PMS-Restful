import React from 'react'

const AddRegistrationForm = ({ onSubmit, initialData }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    onSubmit({
      plateNumber: formData.get('plateNumber'),
      parkingCode: formData.get('parkingCode'),
      entryDateTime: formData.get('entryDateTime') || new Date(),
      slot: 'N/A'
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700">
          Plate Number
        </label>
        <input
          type="text"
          name="plateNumber"
          id="plateNumber"
          defaultValue={initialData?.plateNumber}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="parkingCode" className="block text-sm font-medium text-gray-700">
          Parking Code
        </label>
        <input
          type="text"
          name="parkingCode"
          id="parkingCode"
          defaultValue={initialData?.parkingCode}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="entryDateTime" className="block text-sm font-medium text-gray-700">
          Entry Date & Time
        </label>
        <input
          type="datetime-local"
          name="entryDateTime"
          id="entryDateTime"
          defaultValue={initialData?.entryDateTime}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {initialData ? 'Update' : 'Register'}
        </button>
      </div>
    </form>
  )
}

export default AddRegistrationForm