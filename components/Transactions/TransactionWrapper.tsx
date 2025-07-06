import React from 'react'
import TransactionBox from './TransactionBox'

function TransactionWrapper() {
  return (
    <div className='h-full w-full border rounded-sm p-2 '>
        <TransactionBox/>
    </div>
  )
}

export default TransactionWrapper