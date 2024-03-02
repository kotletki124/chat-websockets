export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export interface DebounceReturn {
  cancel: () => void
}

export const debounce = (func: Function, delay = 300) => {
  let timeoutId: NodeJS.Timeout

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
    return {
      cancel: () => {
        clearTimeout(timeoutId)
      }
    }
  }
}

export const scrollChatDown = ({ hide = false, delay = 300 } = {}) => {
  if (hide) {
    const chatEl = document.querySelector('#chat')
    chatEl?.classList.add('hidden')
    setTimeout(() => {
      chatEl?.classList.remove('hidden')
    }, delay + 50)
  }
  setTimeout(() => {
    const anchorEl = document.querySelector('#scroll-anchor')
    anchorEl?.scrollIntoView({
      behavior: hide ? 'auto' : 'smooth'
    })
  }, 300)
}
