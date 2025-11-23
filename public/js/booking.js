// Booking form multi-step functionality
let currentStep = 1

function nextStep(step) {
  // Validate current step
  const currentStepElement = document.getElementById(`step${step}`)
  const form = currentStepElement.querySelector("form")

  if (form && !form.checkValidity()) {
    form.reportValidity()
    return
  }

  // Hide current step
  currentStepElement.classList.remove("active")
  document.querySelector(`.step[data-step="${step}"]`).classList.remove("active")

  // Show next step
  currentStep = step + 1
  document.getElementById(`step${currentStep}`).classList.add("active")
  document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("active")

  // Update summary if needed
  updateBookingSummary()
}

function prevStep(step) {
  // Hide current step
  document.getElementById(`step${step}`).classList.remove("active")
  document.querySelector(`.step[data-step="${step}"]`).classList.remove("active")

  // Show previous step
  currentStep = step - 1
  document.getElementById(`step${currentStep}`).classList.add("active")
  document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("active")
}

function updateBookingSummary() {
  // Update selected service
  const selectedService = document.querySelector('input[name="serviceType"]:checked')
  if (selectedService) {
    const serviceLabel = document.querySelector(`label[for="${selectedService.id}"] span`).textContent
    document.getElementById("selectedService").textContent = serviceLabel
  }
}

function completeBooking() {
  const form = document.getElementById("paymentForm")
  const termsChecked = document.getElementById("terms").checked

  if (!form.checkValidity() || !termsChecked) {
    form.reportValidity()
    return
  }

  // Show success message
  alert("Booking completed successfully! You will receive a confirmation email shortly.")

  // In a real application, this would submit the form to the server
  console.log("Booking completed")
}

// Update service type in summary when changed
document.querySelectorAll('input[name="serviceType"]').forEach((radio) => {
  radio.addEventListener("change", updateBookingSummary)
})
