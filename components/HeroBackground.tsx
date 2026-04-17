'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  radius: number
  opacity: number
  speed: number
  drift: number
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number

    function resize() {
      canvas!.width = canvas!.offsetWidth
      canvas!.height = canvas!.offsetHeight
    }
    resize()

    const COUNT = 55
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas!.width,
      y: Math.random() * canvas!.height,
      radius: Math.random() * 1.4 + 0.4,
      opacity: Math.random() * 0.22 + 0.05,
      speed: Math.random() * 0.28 + 0.08,
      drift: (Math.random() - 0.5) * 0.18,
    }))

    function draw() {
      const { width, height } = canvas!
      ctx!.clearRect(0, 0, width, height)

      for (const p of particles) {
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(167, 139, 250, ${p.opacity})`
        ctx!.fill()

        p.y -= p.speed
        p.x += p.drift

        if (p.y < -6) {
          p.y = height + 6
          p.x = Math.random() * width
        }
        if (p.x < -6) p.x = width + 6
        if (p.x > width + 6) p.x = -6
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}
