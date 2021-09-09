import clsx from 'clsx'
import React from 'react'
import { Placement } from 'tippy.js'
import Contact from '../models/Contact'
import Tooltip from './Tooltip'

interface AvatarProps {
  border?: string
  className?: string
  contact?: Contact | string
  disableTooltip?: boolean
  size?: string
  tooltipPlacement?: Placement
}

const Avatar = ({
  border,
  className,
  contact,
  disableTooltip,
  size = 'w-12 h-12',
  tooltipPlacement = 'right',
}: AvatarProps) => {
  return (
    <Tooltip
      content={
        <>{contact instanceof Contact ? contact.getFullName() : contact}</>
      }
      disabled={disableTooltip}
      placement={tooltipPlacement}
    >
      <div
        className={clsx(
          'flex items-center justify-center flex-shrink-0 bg-gray-700 rounded-full select-none',
          className,
          border,
          size
        )}
      >
        {contact instanceof Contact && contact.getInitials() ? (
          <span className="text-base font-semibold">
            {contact.getInitials()}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center overflow-hidden rounded-full">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 83 89">
              <path d="M41.864 43.258c10.45 0 19.532-9.375 19.532-21.582C61.396 9.616 52.314.68 41.864.68c-10.449 0-19.53 9.13-19.53 21.093 0 12.11 9.032 21.485 19.53 21.485zM11.152 88.473H72.48c7.715 0 10.449-2.198 10.449-6.495 0-12.597-15.772-29.98-41.113-29.98C16.523 51.998.75 69.381.75 81.978c0 4.297 2.735 6.495 10.4 6.495z" />
            </svg>
          </span>
        )}
      </div>
    </Tooltip>
  )
}

export default Avatar
