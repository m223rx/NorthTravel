let currentStep = 1

function nextStep(step) {
  const currentStepElement = document.getElementById(`step${step}`)
  const form = currentStepElement.querySelector("form")

  if (form && !form.checkValidity()) {
    form.reportValidity()
    return
  }
  
  currentStepElement.classList.remove("active")
  document.querySelector(`.step[data-step="${step}"]`).classList.remove("active")
  
  currentStep = step + 1
  document.getElementById(`step${currentStep}`).classList.add("active")
  document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("active")
  
  updateBookingSummary()
}

function prevStep(step) {
  document.getElementById(`step${step}`).classList.remove("active")
  document.querySelector(`.step[data-step="${step}"]`).classList.remove("active")
  currentStep = step - 1
  document.getElementById(`step${currentStep}`).classList.add("active")
  document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("active")
}

function updateBookingSummary() {
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
  alert("Booking completed successfully! You will receive a confirmation email shortly.")
  console.log("Booking completed")
}

document.querySelectorAll('input[name="serviceType"]').forEach((radio) => {
  radio.addEventListener("change", updateBookingSummary)
})
