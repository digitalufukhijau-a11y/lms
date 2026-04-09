/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Make specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific properties optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Extract promise type
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T

/**
 * Extract array element type
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never

/**
 * Nullable type
 */
export type Nullable<T> = T | null

/**
 * Make all properties nullable recursively
 */
export type DeepNullable<T> = {
  [P in keyof T]: T[P] extends object ? DeepNullable<T[P]> : T[P] | null
}
