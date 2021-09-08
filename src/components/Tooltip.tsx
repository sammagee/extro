import Tippy from '@tippyjs/react'
import React, { ReactElement } from 'react'
import { animateFill, followCursor, Placement } from 'tippy.js'
import 'tippy.js/animations/shift-away.css'

interface TooltipProps {
  children: ReactElement
  content: ReactElement | string
  placement: Placement
}

export default function Tooltip({
  children,
  content,
  placement = 'bottom',
}: TooltipProps) {
  return (
    <Tippy
      animateFill={true}
      content={content}
      followCursor={true}
      plugins={[animateFill, followCursor]}
      placement={placement}
    >
      {children}
    </Tippy>
  )
}
