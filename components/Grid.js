import React from "react";

const Grid = ({ children }) => {
  return (
    <div className='space-y-3'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  overflow-y-auto p-1'>
                {children}
          </div>
    </div>
  );
};

export default Grid;
