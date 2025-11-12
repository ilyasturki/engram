<script setup lang="ts">
import { formatFileSize, formatRelativeTime } from '#imports'
import type { Folder, Video } from '~~/shared/types/types'
import { computed } from 'vue'

interface Props {
    items: (Folder | Video)[]
}

const props = defineProps<Props>()

function getIcon(item: Folder | Video): string {
    return item.type === 'folder' ? 'lucide:folder' : 'lucide:file-video'
}

function getMetadata(item: Folder | Video): string {
    return item.type === 'folder' ?
            item.videos.length.toString()
        :   formatFileSize(item.size)
}

function getDisplayName(item: Folder | Video): string {
    const pathSegments = item.path.split('/')
    const lastSegment = pathSegments[pathSegments.length - 1]

    if (item.type === 'folder') {
        return lastSegment
    }

    const lastDotIndex = lastSegment.lastIndexOf('.')
    return lastDotIndex > 0 ? lastSegment.substring(0, lastDotIndex) : lastSegment
}

const columnHeader = computed(() => {
    if (props.items.length === 0) return 'Info'
    return props.items[0]?.type === 'folder' ? 'Videos' : 'Size'
})
</script>

<template>
    <div class="mx-auto max-w-7xl">
        <div
            class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
            <div
                class="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
                <div class="w-10"></div>
                <div>Name</div>
                <div class="hidden min-w-32 text-right sm:block">Modified</div>
                <div class="min-w-20 text-right">{{ columnHeader }}</div>
            </div>
            <NuxtLink
                v-for="item in items"
                :key="item.path"
                :to="`/library/${item.path}`"
                class="group grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-gray-100 px-4 py-3 transition-colors last:border-b-0 hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:active:bg-gray-600"
            >
                <div
                    class="flex w-10 items-center justify-center text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                >
                    <Icon :name="getIcon(item)" />
                </div>
                <div
                    class="flex items-center truncate font-medium text-gray-900 dark:text-gray-100"
                >
                    {{ getDisplayName(item) }}
                </div>
                <div
                    class="hidden min-w-32 items-center justify-end text-sm text-gray-500 dark:text-gray-400 sm:flex"
                >
                    {{ formatRelativeTime(new Date(item.mtime)) }}
                </div>
                <div
                    class="flex min-w-20 items-center justify-end text-sm text-gray-500 dark:text-gray-400"
                >
                    {{ getMetadata(item) }}
                </div>
            </NuxtLink>
        </div>
    </div>
</template>
