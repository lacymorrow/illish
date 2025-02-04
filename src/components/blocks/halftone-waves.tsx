"use client"

import { useEffect, useRef } from "react"

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawHalftoneWave = () => {
      const gridSize = 20
      const rows = Math.ceil(canvas.height / gridSize)
      const cols = Math.ceil(canvas.width / gridSize)
      const depth = 500 // Maximum depth of the 3D space

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const centerX = x * gridSize - canvas.width / 2
          const centerY = y * gridSize - canvas.height / 2

          // Calculate z-coordinate based on time and position
          const z = (Math.sin((x + y) * 0.1 + time) * depth) / 2 + depth / 2

          // Project 3D coordinates to 2D
          const scale = depth / (depth + z)
          const projectedX = centerX * scale + canvas.width / 2
          const projectedY = centerY * scale + canvas.height / 2

          const distanceFromCenter = Math.sqrt(centerX * centerX + centerY * centerY)
          const maxDistance = Math.sqrt(Math.pow(canvas.width / 2, 2) + Math.pow(canvas.height / 2, 2))
          const normalizedDistance = distanceFromCenter / maxDistance

          const waveOffset = Math.sin(normalizedDistance * 5 - time * 0.5) * 0.5 + 0.5
          const size = gridSize * scale * waveOffset * 0.8

          ctx.beginPath()
          ctx.arc(projectedX, projectedY, size / 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${waveOffset * 0.5 * scale})`
          ctx.fill()
        }
      }
    }

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drawHalftoneWave()

      time += 0.02
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black perspective-1000">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

