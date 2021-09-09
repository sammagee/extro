import Tippy from '@tippyjs/react'
import React, { ReactElement } from 'react'
import { animateFill, followCursor, Placement } from 'tippy.js'
import 'tippy.js/animations/shift-away.css'

interface TooltipProps {
  children: ReactElement
  content: ReactElement | string
  disabled?: boolean
  placement: Placement
}

export default function Tooltip({
  children,
  content,
  disabled,
  placement = 'bottom',
}: TooltipProps) {
  return (
    <Tippy
      animateFill={true}
      content={content}
      disabled={disabled}
      followCursor={true}
      plugins={[animateFill, followCursor]}
      placement={placement}
    >
      {children}
    </Tippy>
  )
}
