'use client'

import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  targetOpacity: number
  connections: number[]
  life: number
  maxLife: number
}

interface AnimatedCanvasProps {
  className?: string
  primaryColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  particleCount?: number
  particleSize?: number
  connectionDistance?: number
  interactive?: boolean
  backgroundColor?: string
}

export default function AnimatedCanvas({
  className = '',
  primaryColor = '#2563EB', // Blue
  secondaryColor = '#7E22CE', // Purple
  tertiaryColor = '#F97316', // Orange
  particleCount = 40,
  particleSize = 2,
  connectionDistance = 100,
  interactive = true,
  backgroundColor = 'rgba(0, 0, 0, 0.8)'
}: AnimatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * particleSize + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5,
        targetOpacity: Math.random() * 0.5 + 0.1,
        connections: [],
        life: 0,
        maxLife: Math.random() * 100 + 100
      })
    }
    
    particlesRef.current = particles
  }
  
  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const { width, height } = canvas
    
    // Clear canvas with semi-transparent background for trail effect
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, width, height)
    
    const particles = particlesRef.current
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      
      // Update position
      p.x += p.speedX
      p.y += p.speedY
      
      // Boundary check with bounce
      if (p.x < 0 || p.x > width) {
        p.speedX *= -1
      }
      
      if (p.y < 0 || p.y > height) {
        p.speedY *= -1
      }
      
      // Gradually change opacity
      p.opacity += (p.targetOpacity - p.opacity) * 0.01
      if (Math.abs(p.opacity - p.targetOpacity) < 0.01) {
        p.targetOpacity = Math.random() * 0.5 + 0.1
      }
      
      // Update life
      p.life++
      if (p.life > p.maxLife) {
        // Reset particle
        p.x = Math.random() * width
        p.y = Math.random() * height
        p.speedX = (Math.random() - 0.5) * 0.5
        p.speedY = (Math.random() - 0.5) * 0.5
        p.life = 0
        p.maxLife = Math.random() * 100 + 100
      }
      
      // Mouse interaction
      if (interactive && mouseRef.current.active) {
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < connectionDistance) {
          const force = (connectionDistance - distance) / connectionDistance
          p.speedX += dx * force * 0.01
          p.speedY += dy * force * 0.01
        }
      }
      
      // Find connections
      p.connections = []
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < connectionDistance) {
          p.connections.push(j)
        }
      }
      
      // Draw connections
      ctx.beginPath()
      for (const j of p.connections) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const opacity = 1 - distance / connectionDistance
        
        // Create gradient for connection
        const gradient = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y)
        gradient.addColorStop(0, `rgba(${hexToRgb(primaryColor)}, ${opacity * p.opacity})`)
        gradient.addColorStop(0.5, `rgba(${hexToRgb(secondaryColor)}, ${opacity * p.opacity})`)
        gradient.addColorStop(1, `rgba(${hexToRgb(tertiaryColor)}, ${opacity * p.opacity})`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = Math.min(p.size, p2.size) * 0.5
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p2.x, p2.y)
      }
      ctx.stroke()
      
      // Draw particle
      const particleGradient = ctx.createRadialGradient(
        p.x, p.y, 0,
        p.x, p.y, p.size * 2
      )
      
      particleGradient.addColorStop(0, `rgba(${hexToRgb(primaryColor)}, ${p.opacity})`)
      particleGradient.addColorStop(0.5, `rgba(${hexToRgb(secondaryColor)}, ${p.opacity * 0.5})`)
      particleGradient.addColorStop(1, `rgba(${hexToRgb(tertiaryColor)}, 0)`)
      
      ctx.beginPath()
      ctx.fillStyle = particleGradient
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }
  
  // Helper function to convert hex to rgb
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0'
  }
  
  // Setup canvas and animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const handleResize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      setDimensions({ width, height })
      
      // Reinitialize particles on resize
      initParticles(width, height)
    }
    
    // Set initial size
    handleResize()
    
    // Add event listeners
    window.addEventListener('resize', handleResize)
    
    if (interactive) {
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect()
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true
        }
      })
      
      canvas.addEventListener('mouseleave', () => {
        mouseRef.current.active = false
      })
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault()
        const rect = canvas.getBoundingClientRect()
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true
        }
      }, { passive: false })
      
      canvas.addEventListener('touchend', () => {
        mouseRef.current.active = false
      })
    }
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [interactive, particleCount, particleSize, connectionDistance])
  
  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: backgroundColor }}
    />
  )
} 