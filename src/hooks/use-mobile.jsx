// Mobile Detection Hook for PawnRace Chess Academy
// Detects if the user is on a mobile device for responsive UI

import { useState, useEffect } from "react"

// Breakpoint for mobile detection (in pixels)
const MOBILE_BREAKPOINT = 768

// Custom hook to detect mobile devices
export function useMobile() {
  const [isMobile, setIsMobile] = useState(undefined)

  useEffect(() => {
    // Function to check if current screen size is mobile
    function checkIsMobile() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Check immediately
    checkIsMobile()

    // Listen for window resize events
    window.addEventListener("resize", checkIsMobile)

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return !!isMobile
}