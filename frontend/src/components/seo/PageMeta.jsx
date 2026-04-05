import { useEffect } from 'react'

const setMeta = (name, content, attribute = 'name') => {
  if (!content) {
    return
  }

  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export default function PageMeta({ description, title }) {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('twitter:title', title, 'name')
    setMeta('twitter:description', description, 'name')
  }, [description, title])

  return null
}
