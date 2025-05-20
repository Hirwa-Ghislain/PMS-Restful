// components/PaginatedTable.jsx
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PaginatedTable = ({ columns, data, rowsPerPage = 5, onEdit, onDelete, deletingId, renderActions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const onPrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const onNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  // Add action buttons to each row
  const renderActionButtons = (row) => {
    if (renderActions) return renderActions(row)
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(row)}
          className="p-1 text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(row.id)}
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
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto max-w-full">
      <table className="min-w-full divide-y divide-gray-300 table-auto">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(({ header }) => (
              <th
                key={header}
                className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap"
              >
                {header}
              </th>
            ))}
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {currentData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="px-3 py-8 text-center text-gray-500 text-sm">
                No data available.
              </td>
            </tr>
          ) : (
            currentData.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map(({ accessor }) => (
                  <td
                    key={accessor}
                    className="px-3 py-2 whitespace-nowrap text-xs text-gray-700"
                  >
                    {row[accessor]}
                  </td>
                ))}
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-700">
                  {renderActionButtons(row)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex flex-wrap justify-between items-center px-3 py-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          Previous
        </button>

        <span className="text-xs text-gray-600">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            currentPage === totalPages || totalPages === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;
