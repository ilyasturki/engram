export function formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
}

const MILLISECONDS_IN_SECOND = 1000
const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
const HOURS_IN_DAY = 24
const DAYS_IN_WEEK = 7
const WEEKS_IN_MONTH = 4
const DAYS_IN_MONTH = 30
const MONTHS_IN_YEAR = 12
const DAYS_IN_YEAR = 365

export function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor(
        (now.getTime() - date.getTime()) / MILLISECONDS_IN_SECOND,
    )

    if (diffInSeconds < 0) {
        return 'just now'
    }

    if (diffInSeconds < SECONDS_IN_MINUTE) {
        return 'just now'
    }

    const diffInMinutes = Math.floor(diffInSeconds / SECONDS_IN_MINUTE)
    if (diffInMinutes < MINUTES_IN_HOUR) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / MINUTES_IN_HOUR)
    if (diffInHours < HOURS_IN_DAY) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
    }

    const diffInDays = Math.floor(diffInHours / HOURS_IN_DAY)
    if (diffInDays < DAYS_IN_WEEK) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
    }

    const diffInWeeks = Math.floor(diffInDays / DAYS_IN_WEEK)
    if (diffInWeeks < WEEKS_IN_MONTH) {
        return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`
    }

    const diffInMonths = Math.floor(diffInDays / DAYS_IN_MONTH)
    if (diffInMonths < MONTHS_IN_YEAR) {
        return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`
    }

    const diffInYears = Math.floor(diffInDays / DAYS_IN_YEAR)
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`
}
