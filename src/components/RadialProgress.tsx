import React, { useEffect, useState } from 'react'

interface RadialProgressProps {
  className?: string
  color: string
  progress: number
  radius: number
  stroke: number
}

const RadialProgress = ({
  className,
  color,
  progress,
  radius,
  stroke
}: RadialProgressProps) => {
  const [normalizedRadius, setNormalizedRadius] = useState<number>(0)
  const [circumference, setCircumference] = useState<number>(0)
  const [strokeDashoffset, setStrokeDashoffset] = useState<number>(0)

  useEffect(() => setNormalizedRadius(radius - stroke * 2), [radius, stroke])
  useEffect(() => setCircumference(normalizedRadius * 2 * Math.PI), [normalizedRadius])
  useEffect(() => setStrokeDashoffset(circumference - progress / 100 * circumference), [circumference, progress])

  return (
    <svg
      className={className}
      width={radius * 2}
      height={radius * 2}
      viewBox={`0 0 ${radius * 2} ${radius * 2}`}
    >
      <circle
        className={color}
        stroke="currentColor"
        fill="transparent"
        strokeLinecap="round"
        strokeDasharray={circumference + ' ' + circumference}
        strokeWidth={stroke}
        style={{ strokeDashoffset, transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 0.5s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  )
}

export default RadialProgress
