import React from 'react'

const IconMenu = ({ className }) => {
  return (
    <svg
      className={className || ''}
      width="24"
      height="15"
      viewBox="0 0 24 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M24 0H0V1.00003H24V0Z" />
      <path d="M24 7.00003H0V8.00006H24V7.00003Z" />
      <path d="M24 14.0001H0V15.0001H24V14.0001Z" />
    </svg>
  )
}

export default IconMenu
