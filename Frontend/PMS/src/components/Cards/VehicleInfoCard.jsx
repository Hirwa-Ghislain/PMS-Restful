import React from 'react';
import { LuCar, LuTrash2 } from 'react-icons/lu';

const VehicleInfoCard = ({
  licensePlate,
  make,
  model,
  color,
  createdAt,
  onDelete,
  hideDeleteBtn = false,
}) => {
  return (
    <div className="group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60">
      <div className="w-12 h-12 flex items-center justify-center text-xl text-gray-800 bg-gray-100 rounded-full">
        <LuCar />
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 font-medium">{licensePlate}</p>
          <p className="text-xs text-gray-400 mt-1">
            {make} {model} • {color}
          </p>
          <p className="text-xs text-gray-300">{new Date(createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-2">
          {!hideDeleteBtn && (
            <button
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={onDelete}
            >
              <LuTrash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoCard;
