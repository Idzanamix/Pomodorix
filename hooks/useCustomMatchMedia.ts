import useMatchMedia from 'use-match-media-hook'

export function useCustomMatchMedia() {
  const queries = [
    '(max-width: 768px)',
    '(min-width: 1024px)',
  ]

  const [mobile, desktop] = useMatchMedia(queries);

  return {
    mobile: mobile,
    desktop: desktop,
  }
}


