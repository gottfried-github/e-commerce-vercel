import React from 'react'

const IconClose = ({ className }) => {
  const clipPathId = Date.now().toString()

  return (
    <svg
      className={className || ''}
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath={`url(#${clipPathId})`}>
        <path d="M1.00003 3.05176e-05L25 24Z" />
        <path d="M0.645935 0.356185L23.9336 23.6439L25.3531 23.646L2.06219 0.355118L0.645935 0.356185Z" />
        <path d="M25 3.05176e-05L1.00001 24Z" />
        <path d="M25.3541 0.356185L2.0664 23.6439L0.646911 23.646L23.9378 0.355118L25.3541 0.356185Z" />
      </g>
      <defs>
        <clipPath id={clipPathId}>
          <rect width="26" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

export default IconClose
