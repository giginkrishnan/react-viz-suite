type IconProps = {
  className?: string
  size?: number
}

/** Solid plane takeoff mark for flight bookings. */
export function FlightBookingIcon({ className, size = 28 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path
        d="M4.5 18.2 14.8 14.5 28.2 7.8c.7-.35 1.45.35 1.15 1.05L22.8 22.1l-1.55 5.2c-.2.7-1.15.85-1.6.25l-2.7-3.55-4.35 1.55c-.55.2-1.1-.3-.95-.85l.95-3.35-5.45-4.05c-.55-.4-.35-1.25.35-1.1Z"
        fill="currentColor"
      />
      <path
        d="M6.2 24.8c3.4-.15 6.1.55 8.1 2.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  )
}

/** Solid hotel / bed mark for hotel bookings. */
export function HotelBookingIcon({ className, size = 28 }: IconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 25.5V12.2c0-.7.55-1.25 1.25-1.25H12c.7 0 1.25.55 1.25 1.25v3.05h8.25c2.35 0 4.25 1.9 4.25 4.25v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 25.5h22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="9.4" cy="15.4" r="2.1" fill="currentColor" />
      <path
        d="M13.25 18.8h9.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}
