import React, { useState, useRef } from 'react'
import { relativeCoords, shuffle } from './util'

export default function() {
  const COLUMN_COUNT = 4
  const [image, setImage] = useState('')
  const canvasElGame = useRef(null)
  const canvasElOriginal = useRef(null)
  const img = new Image()

  img.onload = function() {
    const ctxGame = canvasElGame.current.getContext('2d')
    const ctxOriginal = canvasElOriginal.current.getContext('2d')
    const imageSlices = []
    ctxOriginal.drawImage(this, 0, 0)
    ctxGame.font = '20px Verdana'
    ctxGame.textAlign = 'center'
    ctxGame.textBaseline = 'middle'
    ctxGame.fillStyle = 'white'

    for (let i = 0; i < COLUMN_COUNT; i++) {
      imageSlices[i] = []
      for (let j = 0; j < COLUMN_COUNT; j++) {
        const id = i*4+j
        const imageSlice = ctxOriginal.getImageData(i*100, j*100, 100, 100)
        imageSlices[i].push({imageSlice, id})
      }
    }

    const shuffledImages = imageSlices.map(xs => shuffle(xs))
    const randomXs = Math.floor(Math.random()*shuffledImages.length)
    const randomCellIdx = Math.floor(Math.random()*shuffledImages[randomXs].length)
    console.log({randomXs, randomCellIdx})
    shuffledImages[randomXs].splice(randomCellIdx, 1)
    
    for (let i = 0; i < shuffledImages.length; i++) {
      for (let j = 0; j < shuffledImages[i].length; j++) {
        const {imageSlice, id} = shuffledImages[i][j]
        ctxGame.putImageData(imageSlice, i*100, j*100)
        ctxGame.fillText(id, i*100, j*100)
      }
    }
  }

  img.src = './react.png'

  const displayImage = image => {
    const reader = new FileReader()
    
    reader.onload = e => {
      setImage(e.target.result)
    }
    
    reader.readAsDataURL(image)
  }
  
  const movePiece = event => {
    console.log(relativeCoords(event))
  }

  return (
    <div style={{display:'flex'}}>
      <canvas onClick={e => movePiece(e)} width="400" height="400" ref={canvasElGame}></canvas>
      <canvas width="400" height="400" ref={canvasElOriginal}></canvas>
      
      <form>
        <label htmlFor="filename">Select image</label>
        <input onChange={e => displayImage(e.target.files[0])} type="file" id="filename" name="filename" accept="image/gif, image/jpeg, image/png" />
        <button>Ok</button>
      </form>
    </div>
  )
}