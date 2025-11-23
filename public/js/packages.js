// Package filtering functionality
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".btn-filter")
  const packageCards = document.querySelectorAll("[data-category]")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Filter packages
      packageCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block"
          card.classList.add("animate-fade-in")
        } else {
          card.style.display = "none"
        }
      })
    })
  })
})
