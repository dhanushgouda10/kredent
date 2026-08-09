const AUTH_STORAGE_KEY = 'kredent_auth'

/** Reads the JWT saved by AuthContext on login, or null if not logged in. */
export function getAuthToken() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw)?.token ?? null : null
  } catch {
    return null
  }
}

/**
 * Reads a human-readable error message out of a failed fetch Response.
 * Understands the shape returned by the Spring Boot backend (message /
 * detail / title / field validation `errors[]`) and falls back to the
 * HTTP status text if the body isn't JSON.
 */
export async function parseErrorMessage(response) {
  try {
    const data = await response.json()
    return (
      data.message ||
      data.detail ||
      data.title ||
      (Array.isArray(data.errors) ? data.errors.map((e) => e.defaultMessage || e.message).join(', ') : null) ||
      response.statusText
    )
  } catch {
    return response.statusText || 'Request failed'
  }
}
