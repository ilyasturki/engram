<script setup lang="ts">
import { formatRelativeTime } from '#imports'
import type { Folder } from '~~/shared/types/types'

interface Props {
    folders: Folder[]
}

defineProps<Props>()
</script>

<template>
    <div class="mx-auto max-w-7xl">
        <div
            class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
            <div
                class="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600"
            >
                <div class="w-10"></div>
                <div>Name</div>
                <div class="hidden min-w-32 text-right sm:block">Modified</div>
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
</template>
