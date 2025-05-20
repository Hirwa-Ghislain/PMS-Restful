import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-gray-50'>
      <div className='w-full max-w-2xl px-8 py-10 bg-white rounded-xl shadow-lg'>
        <h2 className='text-2xl font-semibold text-black mb-6 text-center'>Parking Management System</h2>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
