import React from 'react'
import { Ring2 } from 'ldrs/react'
import 'ldrs/react/Ring2.css'

function Loader() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <Ring2
                size="40"
                stroke="3"
                strokeLength="0.25"
                bgOpacity="0.1"
                speed="0.8"
                color="#314CB6"
            />
        </div>
    )
}

export default Loader
