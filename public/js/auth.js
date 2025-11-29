const axios = require("axios")

const API_URL = "http://localhost/wow-travel/api"

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("authToken")
  const currentPage = window.location.pathname.split("/").pop()
  
  if ((currentPage === "dashboard.html" || currentPage === "settings.html") && !token) {
    window.location.href = "login.html"
    return
  }
  
  if ((currentPage === "login.html" || currentPage === "signup.html") && token) {
    verifyTokenAndRedirect(token)
  }
  
  initializeLoginForm()
  initializeSignupForm()
  initializePasswordToggles()
})

async function verifyTokenAndRedirect(token) {
  try {
    const response = await axios.get(`${API_URL}/verify.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.data.success) {
      window.location.href = "dashboard.html"
    } else {
      localStorage.removeItem("authToken")
      localStorage.removeItem("userData")
    }
  } catch (error) {
    console.error("[v0] Token verification failed:", error)
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
  }
}


function initializeLoginForm() {
  const loginForm = document.getElementById("loginForm")
  if (!loginForm) return

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const rememberMe = document.getElementById("rememberMe").checked

    const loginBtn = document.getElementById("loginBtn")
    const loginBtnText = document.getElementById("loginBtnText")
    const loginBtnSpinner = document.getElementById("loginBtnSpinner")
    
    loginBtn.disabled = true
    loginBtnText.textContent = "Signing In..."
    loginBtnSpinner.style.display = "inline-block"

    try {
      const response = await axios.post(`${API_URL}/login.php`, {
        email: email,
        password: password,
      })

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token)
        localStorage.setItem("userData", JSON.stringify(response.data.user))
        showAlert("loginAlert", "loginAlertMessage", "Success! Redirecting to dashboard...", "success")

        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1000)
      } else {
        showAlert("loginAlert", "loginAlertMessage", response.data.message, "danger")
        resetButton(loginBtn, loginBtnText, loginBtnSpinner, "Sign In")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      showAlert("loginAlert", "loginAlertMessage", "An error occurred. Please try again.", "danger")
      resetButton(loginBtn, loginBtnText, loginBtnSpinner, "Sign In")
    }
  })
}

function initializeSignupForm() {
  const signupForm = document.getElementById("signupForm")
  if (!signupForm) return

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("signupEmail").value
    const password = document.getElementById("signupPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value
    if (password !== confirmPassword) {
      showAlert("signupAlert", "signupAlertMessage", "Passwords do not match", "danger")
      return
    }

    const signupBtn = document.getElementById("signupBtn")
    const signupBtnText = document.getElementById("signupBtnText")
    const signupBtnSpinner = document.getElementById("signupBtnSpinner")
    
    signupBtn.disabled = true
    signupBtnText.textContent = "Creating Account..."
    signupBtnSpinner.style.display = "inline-block"

    try {
      const response = await axios.post(`${API_URL}/register.php`, {
        name: name,
        email: email,
        password: password,
      })

      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token)
        localStorage.setItem("userData", JSON.stringify(response.data.user))
        
        showAlert("signupAlert", "signupAlertMessage", "Account created successfully! Redirecting...", "success")
        
        setTimeout(() => {
          window.location.href = "dashboard.html"
        }, 1000)
      } else {
        showAlert("signupAlert", "signupAlertMessage", response.data.message, "danger")
        resetButton(signupBtn, signupBtnText, signupBtnSpinner, "Create Account")
      }
    } catch (error) {
      console.error("[v0] Signup error:", error)
      showAlert("signupAlert", "signupAlertMessage", "An error occurred. Please try again.", "danger")
      resetButton(signupBtn, signupBtnText, signupBtnSpinner, "Create Account")
    }
  })
}

function initializePasswordToggles() {
  const togglePassword = document.getElementById("togglePassword")
  const toggleSignupPassword = document.getElementById("toggleSignupPassword")
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword")

  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      togglePasswordVisibility("password", this)
    })
  }

  if (toggleSignupPassword) {
    toggleSignupPassword.addEventListener("click", function () {
      togglePasswordVisibility("signupPassword", this)
    })
  }

  if (toggleConfirmPassword) {
    toggleConfirmPassword.addEventListener("click", function () {
      togglePasswordVisibility("confirmPassword", this)
    })
  }
}

function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId)
  const icon = button.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.classList.remove("bi-eye")
    icon.classList.add("bi-eye-slash")
  } else {
    input.type = "password"
    icon.classList.remove("bi-eye-slash")
    icon.classList.add("bi-eye")
  }
}

function showAlert(alertId, messageId, message, type) {
  const alert = document.getElementById(alertId)
  const alertMessage = document.getElementById(messageId)

  alert.className = `alert alert-${type} alert-dismissible fade show`
  alert.style.display = "block"
  alertMessage.textContent = message
}

function resetButton(button, textElement, spinner, originalText) {
  button.disabled = false
  textElement.textContent = originalText
  spinner.style.display = "none"
}

function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userData")
  window.location.href = "login.html"
}

function getAuthToken() {
  return localStorage.getItem("authToken")
}

function getUserData() {
  const userData = localStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      logout()
    }
    return Promise.reject(error)
  },
)
