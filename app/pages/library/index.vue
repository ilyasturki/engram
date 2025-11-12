<script setup lang="ts">
const { data: folders, error } = useFetch('/api/folders')

const MILLISECONDS_IN_SECOND = 1000
const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
const HOURS_IN_DAY = 24
const DAYS_IN_WEEK = 7
const WEEKS_IN_MONTH = 4
const DAYS_IN_MONTH = 30
const MONTHS_IN_YEAR = 12
const DAYS_IN_YEAR = 365

function formatRelativeTime(date: Date): string {
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
</script>

<template>
    <div class="min-h-screen p-4">
        <div
            v-if="error"
            class="p-8 text-center"
        >
            <p class="text-red-500">Error loading folders: {{ error }}</p>
        </div>
        <div
            v-else
            class="mx-auto max-w-7xl"
        >
            <div
                class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
                <div
                    class="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600"
                >
                    <div class="w-10"></div>
                    <div>Name</div>
                    <div class="hidden min-w-32 text-right sm:block">
                        Modified
                    </div>
                    <div class="min-w-20 text-right">Videos</div>
                </div>
                <NuxtLink
                    v-for="folder in folders"
                    :key="folder.path"
                    :to="`/library/${folder.path}`"
                    class="group grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50 active:bg-gray-100"
                >
                    <div
                        class="flex w-10 items-center justify-center text-gray-400 group-hover:text-gray-600"
                    >
                        <Icon name="lucide:folder" />
                    </div>
                    <div
                        class="flex items-center truncate font-medium text-gray-900"
                    >
                        {{ folder.path }}
                    </div>
                    <div
                        class="hidden min-w-32 items-center justify-end text-sm text-gray-500 sm:flex"
                    >
                        {{ formatRelativeTime(new Date(folder.mtime)) }}
                    </div>
                    <div
                        class="flex min-w-20 items-center justify-end text-sm text-gray-500"
                    >
                        {{ folder.videos.length }}
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
