import React from 'react'

function Expense() {
  return (
    <div className='p-4'>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Expense Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Synaptrix Solution Projects & their respective details.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            className="btnBg cursor-pointer text-white text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200"
          >
            <i className="fa-regular fa-coins"></i>
            <span>Add new Expense</span>
          </button>
          <button
            className="bg-slate-50 cursor-pointer text-slate-800 border border-slate-200 text-sm font-medium px-4 py-2 rounded-md flex items-center justify-center space-x-2 hover:bg-slate-100 transition-colors duration-200"
          >
            <i className="fa-sharp-duotone fa-regular fa-arrows-rotate"></i>
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Expense
