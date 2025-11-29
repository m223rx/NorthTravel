window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    if (!form.checkValidity()) {
      e.preventDefault()
      e.stopPropagation()
    }
    form.classList.add("was-validated")
  })
})

let lastScrollTop = 0
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar")
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.style.transform = "translateY(-100%)"
  } else {
    navbar.style.transform = "translateY(0)"
  }
  lastScrollTop = scrollTop
})

const animateOnScroll = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)
  
  const animatedElements = document.querySelectorAll(
    ".animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-zoom-in, .animate-fade-scale",
  )

  animatedElements.forEach((element) => {
    observer.observe(element)
  })
}

const parallaxEffect = () => {
  const parallaxElements = document.querySelectorAll(".parallax")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset

    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  })
}

const animateCounters = () => {
  const counters = document.querySelectorAll(".counter")

  counters.forEach((counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const updateCounter = () => {
      current += increment
      if (current < target) {
        counter.textContent = Math.floor(current)
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCounter()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(counter)
  })
}

const staggerCards = () => {
  const cardContainers = document.querySelectorAll(".card-grid, .row")

  cardContainers.forEach((container) => {
    const cards = container.querySelectorAll(".card")

    cards.forEach((card, index) => {
      card.classList.add("animate-on-scroll")
      card.style.transitionDelay = `${index * 0.1}s`
    })
  })
}

const lazyLoadImages = () => {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.add("animate-fade-in")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

const mouseParallax = () => {
  const hero = document.querySelector(".hero, .hero-section")

  if (hero) {
    const parallaxElements = hero.querySelectorAll("[data-parallax-mouse]")

    hero.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e
      const { offsetWidth, offsetHeight } = hero

      const xPos = (clientX / offsetWidth - 0.5) * 2
      const yPos = (clientY / offsetHeight - 0.5) * 2

      parallaxElements.forEach((element) => {
        const speed = element.dataset.parallaxMouse || 20
        const x = xPos * speed
        const y = yPos * speed
        element.style.transform = `translate(${x}px, ${y}px)`
      })
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  animateOnScroll()
  parallaxEffect()
  animateCounters()
  staggerCards()
  lazyLoadImages()
  mouseParallax()
})

window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})
