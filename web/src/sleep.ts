export const sleep = async (delay: number) => {
  return new Promise<void>((resolve) =>
    window.setTimeout(() => {
      resolve()
    }, delay)
  )
}
