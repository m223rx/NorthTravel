const API_URL = "http://localhost/wow-travel/api";
const axios = window.axios;
const bootstrap = window.bootstrap;

function getUserData() {
    return JSON.parse(localStorage.getItem("userData"))
}

function getAuthToken() {
    return localStorage.getItem("authToken")
}

document.addEventListener("DOMContentLoaded", async () => {
    const token = getAuthToken()
    if (!token) {
        window.location.href = "login.html"
        return
    }

    await loadUserProfile()
    
    initializeSettingsNav()

    initializeProfileForm()
    initializePasswordForm()
    initializePasswordStrength()
    
    initializeScrollAnimations()
})

async function loadUserProfile() {
    try {
        const userData = getUserData()

        if (userData) {
            populateProfileForm(userData)
        }

        const token = getAuthToken()
        const response = await axios.get(`${API_URL}/verify.php`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (response.data.success) {
            const user = response.data.user
            localStorage.setItem("userData", JSON.stringify(user))
            populateProfileForm(user)
        }
    } catch (error) {
        console.error("Error loading profile:", error)
    }
}

function populateProfileForm(user) {
    document.getElementById("navbarUserName").textContent = user.name.split(" ")[0]

    document.getElementById("profileDisplayName").textContent = user.name
    document.getElementById("profileDisplayEmail").textContent = user.email

    if (user.created_at) {
        const date = new Date(user.created_at)
        document.getElementById("memberSince").textContent = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        })
    }

    document.getElementById("profileName").value = user.name || ""
    document.getElementById("profileEmail").value = user.email || ""
    document.getElementById("profilePhone").value = user.phone || ""
    document.getElementById("profileAddress").value = user.address || ""
    document.getElementById("profileCity").value = user.city || ""
    document.getElementById("profileCountry").value = user.country || ""
}

function initializeSettingsNav() {
    const navItems = document.querySelectorAll(".settings-nav-item")
    const panels = document.querySelectorAll(".settings-panel")

    navItems.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault()

            navItems.forEach((nav) => nav.classList.remove("active"))
            item.classList.add("active")

            const sectionId = item.dataset.section
            panels.forEach((panel) => {
                if (panel.id === sectionId) {
                    panel.style.display = "block"
                    panel.classList.add("animate-fade-in")
                } else {
                    panel.style.display = "none"
                }
            })
        })
    })
}

function initializeProfileForm() {
    const profileForm = document.getElementById("profileForm")
    if (!profileForm) return

    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const saveBtn = document.getElementById("saveProfileBtn")
        const saveBtnText = document.getElementById("saveProfileBtnText")
        const saveBtnSpinner = document.getElementById("saveProfileBtnSpinner")

        saveBtn.disabled = true
        saveBtnText.textContent = "Saving..."
        saveBtnSpinner.style.display = "inline-block"

        const profileData = {
            name: document.getElementById("profileName").value,
            email: document.getElementById("profileEmail").value,
            phone: document.getElementById("profilePhone").value,
            address: document.getElementById("profileAddress").value,
            city: document.getElementById("profileCity").value,
            country: document.getElementById("profileCountry").value,
        }

        try {
            const token = getAuthToken()
            const response = await axios.post(`${API_URL}/update-profile.php`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.data.success) {
                const userData = getUserData()
                const updatedUser = { ...userData, ...profileData }
                localStorage.setItem("userData", JSON.stringify(updatedUser))

                populateProfileForm(updatedUser)

                showAlert("settingsAlert", "settingsAlertMessage", "Profile updated successfully!", "success")
            } else {
                showAlert("settingsAlert", "settingsAlertMessage", response.data.message, "danger")
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            showAlert("settingsAlert", "settingsAlertMessage", "An error occurred. Please try again.", "danger")
        } finally {
            saveBtn.disabled = false
            saveBtnText.textContent = "Save Changes"
            saveBtnSpinner.style.display = "none"
        }
    })
}

function initializePasswordForm() {
    const passwordForm = document.getElementById("passwordForm")
    if (!passwordForm) return

    passwordForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const currentPassword = document.getElementById("currentPassword").value
        const newPassword = document.getElementById("newPassword").value
        const confirmNewPassword = document.getElementById("confirmNewPassword").value

        if (newPassword !== confirmNewPassword) {
            showAlert("settingsAlert", "settingsAlertMessage", "New passwords do not match", "danger")
            return
        }

        if (newPassword.length < 8) {
            showAlert("settingsAlert", "settingsAlertMessage", "Password must be at least 8 characters", "danger")
            return
        }

        const changeBtn = document.getElementById("changePasswordBtn")
        const changeBtnText = document.getElementById("changePasswordBtnText")
        const changeBtnSpinner = document.getElementById("changePasswordBtnSpinner")

        changeBtn.disabled = true
        changeBtnText.textContent = "Updating..."
        changeBtnSpinner.style.display = "inline-block"

        try {
            const token = getAuthToken()
            const response = await axios.post(
                `${API_URL}/change-password.php`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )

            if (response.data.success) {
                showAlert("settingsAlert", "settingsAlertMessage", "Password changed successfully!", "success")
                passwordForm.reset()
                resetPasswordStrength()
            } else {
                showAlert("settingsAlert", "settingsAlertMessage", response.data.message, "danger")
            }
        } catch (error) {
            console.error("Error changing password:", error)
            showAlert("settingsAlert", "settingsAlertMessage", "An error occurred. Please try again.", "danger")
        } finally {
            changeBtn.disabled = false
            changeBtnText.textContent = "Update Password"
            changeBtnSpinner.style.display = "none"
        }
    })
}

function initializePasswordStrength() {
    const newPasswordInput = document.getElementById("newPassword")
    if (!newPasswordInput) return

    newPasswordInput.addEventListener("input", () => {
        const password = newPasswordInput.value
        const strength = calculatePasswordStrength(password)
        updatePasswordStrengthUI(strength)
    })
}

function calculatePasswordStrength(password) {
    let strength = 0

    if (password.length >= 8) strength += 25
    if (password.length >= 12) strength += 25
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25
    if (/\d/.test(password)) strength += 15
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10

    return Math.min(strength, 100)
}

function updatePasswordStrengthUI(strength) {
    const strengthBar = document.getElementById("passwordStrengthBar")
    const strengthText = document.getElementById("passwordStrengthText")

    strengthBar.style.width = `${strength}%`

    if (strength < 30) {
        strengthBar.className = "password-strength-bar weak"
        strengthText.textContent = "Weak password"
    } else if (strength < 60) {
        strengthBar.className = "password-strength-bar fair"
        strengthText.textContent = "Fair password"
    } else if (strength < 80) {
        strengthBar.className = "password-strength-bar good"
        strengthText.textContent = "Good password"
    } else {
        strengthBar.className = "password-strength-bar strong"
        strengthText.textContent = "Strong password"
    }
}

function resetPasswordStrength() {
    const strengthBar = document.getElementById("passwordStrengthBar")
    const strengthText = document.getElementById("passwordStrengthText")

    strengthBar.style.width = "0%"
    strengthBar.className = "password-strength-bar"
    strengthText.textContent = "Minimum 8 characters"
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

function resetProfileForm() {
    const userData = getUserData()
    if (userData) {
        populateProfileForm(userData)
    }
}

function resetPreferencesForm() {
    document.getElementById("preferencesForm").reset()
}

function saveNotificationPreferences() {
    const preferences = {
        bookings: document.getElementById("notifyBookings").checked,
        updates: document.getElementById("notifyUpdates").checked,
        promos: document.getElementById("notifyPromos").checked,
        newsletter: document.getElementById("notifyNewsletter").checked,
        priceAlerts: document.getElementById("pushPriceAlerts").checked,
        reminders: document.getElementById("pushReminders").checked,
    }

    localStorage.setItem("notificationPreferences", JSON.stringify(preferences))
    showAlert("settingsAlert", "settingsAlertMessage", "Notification preferences saved!", "success")
}

function savePrivacySettings() {
    const settings = {
        profileVisibility: document.getElementById("profileVisibility").value,
        showBookingHistory: document.getElementById("showBookingHistory").checked,
        shareLocation: document.getElementById("shareLocation").checked,
        analyticsEnabled: document.getElementById("analyticsEnabled").checked,
    }

    localStorage.setItem("privacySettings", JSON.stringify(settings))
    showAlert("settingsAlert", "settingsAlertMessage", "Privacy settings saved!", "success")
}

function downloadData() {
    const userData = getUserData()
    const dataStr = JSON.stringify(userData, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "wow-travel-data.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    showAlert("settingsAlert", "settingsAlertMessage", "Your data has been downloaded!", "success")
}

function confirmDeleteAccount() {
    const modal = new bootstrap.Modal(document.getElementById("deleteAccountModal"))
    modal.show()
}

async function deleteAccount() {
    const password = document.getElementById("deleteConfirmPassword").value

    if (!password) {
        showAlert("settingsAlert", "settingsAlertMessage", "Please enter your password to confirm", "danger")
        return
    }

    try {
        const token = getAuthToken()
        const response = await axios.post(
            `${API_URL}/delete-account.php`,
            {
                password: password,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        )

        if (response.data.success) {
            localStorage.clear()
            window.location.href = "index.html"
        } else {
            showAlert("settingsAlert", "settingsAlertMessage", response.data.message, "danger")
        }
    } catch (error) {
        console.error("Error deleting account:", error)
        showAlert("settingsAlert", "settingsAlertMessage", "An error occurred. Please try again.", "danger")
    }
}

function logoutAllSessions() {
    showAlert("settingsAlert", "settingsAlertMessage", "All other sessions have been logged out", "success")
}

function showAddPaymentModal() {
    showAlert("settingsAlert", "settingsAlertMessage", "Payment methods coming soon!", "info")
}

function showAlert(alertId, messageId, message, type) {
    const alert = document.getElementById(alertId)
    const alertMessage = document.getElementById(messageId)

    alert.className = `alert alert-${type} alert-dismissible fade show`
    alert.style.display = "block"
    alertMessage.textContent = message

    setTimeout(() => {
        alert.style.display = "none"
    }, 5000)
}

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
