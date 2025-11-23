// Dashboard JavaScript
const API_URL = "http://localhost/wow-travel/api"

// Declare helper functions
function getUserData() {
  return JSON.parse(localStorage.getItem("userData"))
}

function getAuthToken() {
  return localStorage.getItem("authToken")
}

// Import axios
const axios = require("axios")

// Load dashboard data on page load
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[v0] Dashboard loading...")

  // Check authentication
  const token = getAuthToken()
  if (!token) {
    window.location.href = "login.html"
    return
  }

  // Load user data
  await loadUserData()

  // Load bookings
  await loadBookings()

  // Initialize animations
  initializeScrollAnimations()
})

// Load user data
async function loadUserData() {
  try {
    const userData = getUserData()

    if (userData) {
      // Update profile info
      document.getElementById("userName").textContent = userData.name.split(" ")[0]
      document.getElementById("navbarUserName").textContent = userData.name.split(" ")[0]
      document.getElementById("profileName").textContent = userData.name
      document.getElementById("profileEmail").textContent = userData.email
    } else {
      // Fetch from API
      const token = getAuthToken()
      const response = await axios.get(`${API_URL}/verify.php`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        const user = response.data.user
        localStorage.setItem("userData", JSON.stringify(user))

        document.getElementById("userName").textContent = user.name.split(" ")[0]
        document.getElementById("navbarUserName").textContent = user.name.split(" ")[0]
        document.getElementById("profileName").textContent = user.name
        document.getElementById("profileEmail").textContent = user.email
      }
    }
  } catch (error) {
    console.error("[v0] Error loading user data:", error)
  }
}

// Load bookings
async function loadBookings() {
  try {
    const token = getAuthToken()
    const response = await axios.get(`${API_URL}/get-bookings.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log("[v0] Bookings response:", response.data)

    if (response.data.success) {
      const bookings = response.data.bookings

      // Update stats
      updateStats(bookings)

      // Display bookings
      displayBookings(bookings)

      // Display upcoming trips
      displayUpcomingTrips(bookings)
    } else {
      showEmptyBookings()
    }
  } catch (error) {
    console.error("[v0] Error loading bookings:", error)
    showEmptyBookings()
  }
}

// Update dashboard stats
function updateStats(bookings) {
  const total = bookings.length
  const pending = bookings.filter((b) => b.status === "pending").length
  const confirmed = bookings.filter((b) => b.status === "confirmed").length
  const destinations = new Set(bookings.map((b) => b.destination)).size

  // Animate counters
  animateCounter("totalBookings", 0, total, 1000)
  animateCounter("pendingBookings", 0, pending, 1000)
  animateCounter("confirmedBookings", 0, confirmed, 1000)
  animateCounter("destinationsVisited", 0, destinations, 1000)
}

// Animate counter
function animateCounter(elementId, start, end, duration) {
  const element = document.getElementById(elementId)
  const range = end - start
  const increment = range / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= end) {
      element.textContent = end
      clearInterval(timer)
    } else {
      element.textContent = Math.floor(current)
    }
  }, 16)
}

// Display bookings
function displayBookings(bookings) {
  const container = document.getElementById("bookingsContainer")

  if (bookings.length === 0) {
    container.innerHTML = `
            <div class="empty-state text-center py-5">
                <i class="bi bi-inbox empty-icon"></i>
                <h4 class="empty-title">No Bookings Yet</h4>
                <p class="empty-text">Start your travel journey by booking your first trip!</p>
                <a href="packages.html" class="btn btn-primary mt-3">Browse Packages</a>
            </div>
        `
    return
  }

  // Sort by date (most recent first)
  bookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  // Show only recent 5 bookings
  const recentBookings = bookings.slice(0, 5)

  container.innerHTML = recentBookings
    .map(
      (booking) => `
        <div class="booking-item">
            <div class="booking-icon">
                <i class="bi bi-${getBookingIcon(booking.booking_type)}"></i>
            </div>
            <div class="booking-info">
                <h4 class="booking-title">${booking.destination || "Destination"}</h4>
                <p class="booking-details">
                    <span class="booking-type">${formatBookingType(booking.booking_type)}</span>
                    <span class="booking-separator">•</span>
                    <span class="booking-date">${formatDate(booking.departure_date)}</span>
                    ${booking.return_date ? `<span class="booking-separator">-</span><span class="booking-date">${formatDate(booking.return_date)}</span>` : ""}
                </p>
            </div>
            <div class="booking-status">
                <span class="status-badge status-${booking.status}">${formatStatus(booking.status)}</span>
                <span class="booking-price">$${Number.parseFloat(booking.total_price).toFixed(2)}</span>
            </div>
        </div>
    `,
    )
    .join("")
}

// Display upcoming trips
function displayUpcomingTrips(bookings) {
  const container = document.getElementById("upcomingTripsContainer")

  // Filter confirmed bookings with future departure dates
  const today = new Date()
  const upcomingTrips = bookings
    .filter((booking) => {
      return booking.status === "confirmed" && new Date(booking.departure_date) > today
    })
    .sort((a, b) => new Date(a.departure_date) - new Date(b.departure_date))

  if (upcomingTrips.length === 0) {
    container.innerHTML = `
            <div class="empty-state text-center py-5">
                <i class="bi bi-calendar-x empty-icon"></i>
                <h4 class="empty-title">No Upcoming Trips</h4>
                <p class="empty-text">Start planning your next adventure!</p>
                <a href="packages.html" class="btn btn-primary mt-3">Browse Packages</a>
            </div>
        `
    return
  }

  container.innerHTML = `
        <div class="row g-4">
            ${upcomingTrips
              .map(
                (trip) => `
                <div class="col-md-6">
                    <div class="trip-card">
                        <div class="trip-header">
                            <div class="trip-icon">
                                <i class="bi bi-${getBookingIcon(trip.booking_type)}"></i>
                            </div>
                            <div class="trip-title">
                                <h4>${trip.destination}</h4>
                                <p>${formatBookingType(trip.booking_type)}</p>
                            </div>
                        </div>
                        <div class="trip-details">
                            <div class="trip-detail-item">
                                <i class="bi bi-calendar-event"></i>
                                <span>Departure: ${formatDate(trip.departure_date)}</span>
                            </div>
                            ${
                              trip.return_date
                                ? `
                                <div class="trip-detail-item">
                                    <i class="bi bi-calendar-check"></i>
                                    <span>Return: ${formatDate(trip.return_date)}</span>
                                </div>
                            `
                                : ""
                            }
                            <div class="trip-detail-item">
                                <i class="bi bi-people"></i>
                                <span>${trip.guests} Guest${trip.guests > 1 ? "s" : ""}</span>
                            </div>
                        </div>
                        <div class="trip-footer">
                            <span class="trip-price">$${Number.parseFloat(trip.total_price).toFixed(2)}</span>
                            <button class="btn btn-sm btn-outline-primary">View Details</button>
                        </div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
    `
}

// Show empty bookings state
function showEmptyBookings() {
  const container = document.getElementById("bookingsContainer")
  container.innerHTML = `
        <div class="empty-state text-center py-5">
            <i class="bi bi-inbox empty-icon"></i>
            <h4 class="empty-title">No Bookings Yet</h4>
            <p class="empty-text">Start your travel journey by booking your first trip!</p>
            <a href="packages.html" class="btn btn-primary mt-3">Browse Packages</a>
        </div>
    `

  // Set all stats to 0
  document.getElementById("totalBookings").textContent = "0"
  document.getElementById("pendingBookings").textContent = "0"
  document.getElementById("confirmedBookings").textContent = "0"
  document.getElementById("destinationsVisited").textContent = "0"
}

// Helper functions
function getBookingIcon(type) {
  const icons = {
    flight: "airplane",
    hotel: "building",
    package: "box-seam",
  }
  return icons[type] || "bookmark"
}

function formatBookingType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

function formatStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function formatDate(dateString) {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Initialize scroll animations
function initializeScrollAnimations() {
  const elements = document.querySelectorAll(".animate-on-scroll")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  elements.forEach((element) => {
    observer.observe(element)
  })
}
