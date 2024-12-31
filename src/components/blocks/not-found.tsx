'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home } from 'lucide-react'

export function NotFoundComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const particles: Particle[] = []

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 1 - 0.5
        this.speedY = Math.random() * 1 - 0.5
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.1) this.size -= 0.01

        // Wrap around screen edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
      }

      draw() {
        ctx.fillStyle = 'rgba(173, 216, 230, 0.5)'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    function handleParticles() {
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        if (particles[i].size <= 0.1) {
          particles.splice(i, 1)
          i--
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (particles.length < 150) {
        particles.push(new Particle())
      }
      handleParticles()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animate)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 space-y-8 max-w-md px-4">
        <div className="relative">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse" style={{ animationDuration: '3s' }}>
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <OrbitingCircles mousePosition={mousePosition} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-100">Reality Not Found</h2>
        <p className="text-gray-300">
          The digital realm you're searching for has slipped into another dimension.
        </p>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <Button asChild className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
            <Link href="/">
              <Home className="w-5 h-5 mr-2" />
              <span className="pr-6 text-gray-100">Return to Base Reality</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function OrbitingCircles({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const circleRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const circle = circleRef.current
    if (!circle) return

    const rect = circle.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const angleX = (mousePosition.x - centerX) / (window.innerWidth / 2) * 15
    const angleY = (mousePosition.y - centerY) / (window.innerHeight / 2) * 15

    circle.style.transform = `rotateX(${angleY}deg) rotateY(${-angleX}deg)`
  }, [mousePosition])

  return (
    <svg ref={circleRef} className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="none" stroke="url(#gradient1)" strokeWidth="0.5" className="animate-spin-slow" style={{ animationDuration: '20s' }} />
      <circle cx="100" cy="100" r="70" fill="none" stroke="url(#gradient2)" strokeWidth="0.5" className="animate-spin-slow" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
      <circle cx="100" cy="100" r="50" fill="none" stroke="url(#gradient3)" strokeWidth="0.5" className="animate-spin-slow" style={{ animationDuration: '10s' }} />
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#43e97b" />
          <stop offset="100%" stopColor="#38f9d7" />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fa709a" />
          <stop offset="100%" stopColor="#fee140" />
        </linearGradient>
      </defs>
    </svg>
  )
}