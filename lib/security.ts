// セキュリティユーティリティ

/**
 * メールアドレスのバリデーション
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * ユーザー名のバリデーション（英数字とアンダースコアのみ、3-20文字）
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}

/**
 * パスワードの強度チェック
 */
export function isStrongPassword(password: string): { 
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('パスワードは8文字以上にしてください')
  }

  if (password.length > 100) {
    errors.push('パスワードは100文字以内にしてください')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('小文字を含めてください')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('大文字を含めてください')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('数字を含めてください')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * XSS対策：HTMLタグをエスケープ
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

/**
 * SQLインジェクション対策：危険な文字列パターンを検出
 */
export function containsSQLInjection(text: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|\*|;|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b).*=.*=/i,
  ]

  return sqlPatterns.some(pattern => pattern.test(text))
}

/**
 * 文字数制限チェック
 */
export function isWithinCharLimit(text: string, maxLength: number): boolean {
  return text.length <= maxLength
}

/**
 * URLのバリデーション
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * レート制限用：IPアドレスベースのリクエストトラッキング
 */
const requestLog = new Map<string, number[]>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const windowStart = now - windowMs

  // 古いエントリを削除
  const requests = (requestLog.get(identifier) || []).filter(
    timestamp => timestamp > windowStart
  )

  if (requests.length >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  // 新しいリクエストを記録
  requests.push(now)
  requestLog.set(identifier, requests)

  return { 
    allowed: true, 
    remaining: maxRequests - requests.length 
  }
}

/**
 * IPアドレスを取得
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}
