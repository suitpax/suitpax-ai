// Este componente ya no se utiliza en el proyecto
"use client"

import { useEffect, useRef } from "react"

type Grid = { alive: boolean; opacity: number }[][]

interface AnimatedBackgroundProps {
  height?: number
  primaryColor?: string
  secondaryColor?: string
}

const AnimatedBackground = ({
  height = 600,
  primaryColor = "rgba(6, 95, 70, 0.08)",
  secondaryColor = "rgba(6, 95, 70, 0.05)",
}: AnimatedBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño del contenedor
    const resizeCanvas = () => {
      if (canvas) {
        const parent = canvas.parentElement
        if (parent) {
          canvas.width = parent.clientWidth
          canvas.height = parent.clientHeight
        }
      }
    }

    // Llamar a resize inicialmente y añadir listener
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    let animationFrameId: number
    const cellSize = 8
    const cols = Math.floor(canvas.width / cellSize)
    const rows = Math.floor(canvas.height / cellSize)
    const transitionSpeed = 0.15 // Controls fade speed

    let grid: Grid = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            alive: Math.random() > 0.8, // Más células vivas para mayor visibilidad
            opacity: Math.random() > 0.8 ? 0.7 : 0, // Mayor opacidad inicial
          })),
      )

    const countNeighbors = (grid: Grid, x: number, y: number): number => {
      let sum = 0
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          const row = (x + i + rows) % rows
          const col = (y + j + cols) % cols
          sum += grid[row][col].alive ? 1 : 0
        }
      }
      sum -= grid[x][y].alive ? 1 : 0
      return sum
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update opacities
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const cell = grid[i][j]
          if (cell.alive && cell.opacity < 1) {
            cell.opacity = Math.min(cell.opacity + transitionSpeed, 0.7) // Mayor opacidad máxima
          } else if (!cell.alive && cell.opacity > 0) {
            cell.opacity = Math.max(cell.opacity - transitionSpeed, 0)
          }

          if (cell.opacity > 0) {
            // Alternar entre dos colores para crear más variedad visual
            const color = j % 2 === 0 ? primaryColor : secondaryColor
            ctx.fillStyle = color
            ctx.beginPath()

            // Dibujar círculos más grandes para mayor visibilidad
            ctx.arc(
              j * cellSize + cellSize / 2,
              i * cellSize + cellSize / 2,
              cellSize / 2.5, // Círculos más grandes
              0,
              Math.PI * 2,
            )
            ctx.fill()

            // Añadir un resplandor para mayor visibilidad
            if (Math.random() > 0.95) {
              ctx.fillStyle = "rgba(6, 95, 70, 0.03)"
              ctx.beginPath()
              ctx.arc(j * cellSize + cellSize / 2, i * cellSize + cellSize / 2, cellSize * 1.5, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      const next = grid.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = countNeighbors(grid, i, j)
          const willBeAlive = cell.alive ? neighbors >= 2 && neighbors <= 3 : neighbors === 3
          return {
            alive: willBeAlive,
            opacity: cell.opacity,
          }
        }),
      )

      grid = next
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(draw)
      }, 150)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [primaryColor, secondaryColor, height])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

export default AnimatedBackground
