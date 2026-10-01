import './style.css'

function setupNavigation(): void {
  const header = document.querySelector<HTMLElement>('.site-header')
  const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
  const nav = document.querySelector<HTMLElement>('#site-navigation')
  if (!header || !toggle || !nav) return

  const compact = window.matchMedia('(max-width: 1100px)')
  let navigationHasFocus = false
  const close = (restoreFocus = false): void => {
    if (restoreFocus && compact.matches) toggle.focus({ preventScroll: true })
    toggle.setAttribute('aria-expanded', 'false')
    header.classList.remove('is-menu-open')
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true'
    toggle.setAttribute('aria-expanded', String(open))
    header.classList.toggle('is-menu-open', open)
  })
  nav.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) close(true)
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close(true)
  })
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !header.contains(event.target)) {
      close(nav.contains(document.activeElement))
    }
  })
  document.addEventListener('focusin', (event) => {
    if (event.target instanceof Node) {
      navigationHasFocus = nav.contains(event.target)
      if (!header.contains(event.target)) close()
    }
  })
  compact.addEventListener('change', () => {
    // Hiding the desktop links can reset activeElement before this event fires.
    close(navigationHasFocus)
    navigationHasFocus = false
  })
  header.classList.add('has-menu')
  toggle.hidden = false
}

setupNavigation()

function positionRouteElements(progress: number): void {
  const path = document.querySelector<SVGPathElement>('#route-line')
  const traveler = document.querySelector<SVGGElement>('[data-route-traveler]')

  if (!path || !traveler) return

  const pathLength = path.getTotalLength()
  const travelerPoint = path.getPointAtLength(pathLength * progress)
  traveler.setAttribute('transform', `translate(${travelerPoint.x} ${travelerPoint.y})`)

  document.querySelectorAll<SVGGElement>('.route-marker').forEach((marker) => {
    const markerProgress = Number(marker.dataset.progress)
    const point = path.getPointAtLength(pathLength * markerProgress)
    marker.setAttribute('transform', `translate(${point.x} ${point.y})`)
  })
}

function setupRouteScroll(): void {
  const scrolly = document.querySelector<HTMLElement>('[data-route-scrolly]')
  const steps = Array.from(document.querySelectorAll<HTMLElement>('[data-route-step]'))
  if (!scrolly || !steps.length) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const wideScreen = window.matchMedia('(min-width: 901px)')
  let animationFrame = 0

  const update = (): void => {
    if (!scrolly?.classList.contains('is-enhanced')) return

    const rect = scrolly.getBoundingClientRect()
    const scrollableDistance = Math.max(rect.height - window.innerHeight, 1)
    const progress = Math.min(Math.max(-rect.top / scrollableDistance, 0), 1)
    scrolly.style.setProperty('--route-progress', progress.toString())
    positionRouteElements(progress)

    let activeStep = steps[0]
    let closestDistance = Number.POSITIVE_INFINITY

    steps.forEach((step) => {
      const stepRect = step.getBoundingClientRect()
      const distance = Math.abs(stepRect.top + stepRect.height / 2 - window.innerHeight / 2)
      if (distance < closestDistance) {
        closestDistance = distance
        activeStep = step
      }
    })

    steps.forEach((step) => step.classList.toggle('is-active', step === activeStep))
  }

  const scheduleUpdate = (): void => {
    cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(update)
  }

  positionRouteElements(reduceMotion.matches ? 0.5 : 0)

  const configure = (): void => {
    const enhanced = !reduceMotion.matches && wideScreen.matches
    scrolly?.classList.toggle('is-enhanced', enhanced)
    if (enhanced) scheduleUpdate()
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', scheduleUpdate)
  wideScreen.addEventListener('change', configure)
  reduceMotion.addEventListener('change', configure)
  configure()

  steps.forEach((step) => {
    step.addEventListener('focus', () => {
      steps.forEach((candidate) => candidate.classList.toggle('is-active', candidate === step))
      if (scrolly?.classList.contains('is-enhanced')) {
        positionRouteElements(Number(step.dataset.progress))
      }
    })
  })
}

setupRouteScroll()

function setupFacebookTimeline(): void {
  const track = document.querySelector<HTMLOListElement>('#facebook-posts')
  const controls = document.querySelector<HTMLElement>('[data-facebook-controls]')
  const previous = document.querySelector<HTMLButtonElement>('[data-facebook-previous]')
  const next = document.querySelector<HTMLButtonElement>('[data-facebook-next]')
  if (!track || !controls || !previous || !next) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const updateControls = (): void => {
    previous.disabled = track.scrollLeft <= 1
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
  }
  const move = (direction: number): void => {
    const step = track.firstElementChild?.getBoundingClientRect().width ?? track.clientWidth
    track.scrollBy({ left: direction * step, behavior: reduceMotion.matches ? 'instant' : 'smooth' })
  }
  previous.addEventListener('click', () => move(-1))
  next.addEventListener('click', () => move(1))
  track.addEventListener('scroll', updateControls, { passive: true })
  window.addEventListener('resize', updateControls)
  controls.hidden = false
  updateControls()
}

setupFacebookTimeline()
