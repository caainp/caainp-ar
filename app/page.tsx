'use client'

import { Application, Entity } from '@playcanvas/react'
import { XRScene } from './components/XRScene'
import { Camera } from '@playcanvas/react/components'

export const App = () => {
  return (
    <Application>
      <XRScene />
      <Entity name="Camera">
        <Camera />
      </Entity>
    </Application>
  )

}

export default App