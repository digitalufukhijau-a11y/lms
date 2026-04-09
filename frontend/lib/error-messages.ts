export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  AUTH_ERROR: 'Terjadi kesalahan autentikasi. Silakan login kembali.',
  NOT_FOUND: 'Data tidak ditemukan.',
  PERMISSION_DENIED: 'Anda tidak memiliki izin untuk mengakses resource ini.',
  VALIDATION_ERROR: 'Data yang Anda masukkan tidak valid.',
  SERVER_ERROR: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
  UNKNOWN_ERROR: 'Terjadi kesalahan yang tidak diketahui.',
} as const

export function getErrorMessage(error: Error | unknown): string {
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return ERROR_MESSAGES.AUTH_ERROR
    }
    if (error.message.includes('not found')) {
      return ERROR_MESSAGES.NOT_FOUND
    }
    if (error.message.includes('permission') || error.message.includes('forbidden')) {
      return ERROR_MESSAGES.PERMISSION_DENIED
    }
    
    return error.message
  }
  
  return ERROR_MESSAGES.UNKNOWN_ERROR
}
