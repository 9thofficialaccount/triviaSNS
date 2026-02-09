/**
 * ユーティリティ関数
 */

import clsx, { ClassValue } from 'clsx'

/**
 * クラス名を結合する
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * テキストを指定文字数で切り詰める
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * URLが有効かどうかをチェック
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 日本語の文字数をカウント（全角1文字、半角0.5文字として計算）
 */
export function countJapaneseChars(text: string): number {
  let count = 0
  for (const char of text) {
    // 全角文字（日本語、中国語、記号など）
    if (char.match(/[^\x00-\x7F]/)) {
      count += 1
    } else {
      // 半角文字
      count += 0.5
    }
  }
  return Math.ceil(count)
}

/**
 * 数値をK/M形式にフォーマット（例：1000 -> 1K）
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * テキストから簡単なハイライトを生成
 */
export function highlightText(text: string, query: string): string {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
