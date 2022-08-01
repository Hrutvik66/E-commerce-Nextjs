import React from 'react'

const HorizontalGrid = ({heading,children}) => {
  return (
      <div className='space-y-3'>
          <h2 className='text-lg font-bold pl-1'>{heading}</h2>
          <div className='flex space-x-5 overflow-x-auto p-1'>
                {children}
          </div>
    </div>
  )
}

export default HorizontalGrid