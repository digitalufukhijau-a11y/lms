export function logError(error: Error | unknown, context?: string): void {
  if (error instanceof Error) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, {
      message: error.message,
      name: error.name,
      stack: error.stack,
    })
  } else {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error)
  }
}
