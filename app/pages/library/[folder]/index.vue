<script setup lang="ts">
import type { Folder } from '#imports'
import type { Video } from '~~/shared/types/types'

const route = useRoute()
const { folder } = route.params
if (folder === undefined || folder === '') {
    navigateTo('/library')
}

const { data: folderData, error } = await useFetch<Folder>(
    `/api/folders/${folder}`,
)

function getFileName(videoData: Video): string {
    return videoData.path.split('/').pop() || videoData.path
}
</script>

<template>
    <div class="p-4">
        <div
            v-if="error"
            class="text-center"
        >
            <p class="text-red-500">
                Error loading folder: {{ error.message }}
            </p>
        </div>
        <div v-else-if="folderData">
            <h1 class="mb-6 text-2xl font-bold">{{ folderData.path }}</h1>
            <ul
                v-if="folderData.videos.length > 0"
                class="space-y-2"
            >
                <li
                    v-for="video in folderData.videos"
                    :key="video.path"
                >
                    <NuxtLink
                        :to="`/library/${video.path}`"
                        class="block rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <div class="font-medium">
                            {{ getFileName(video) }}
                        </div>
                        <div class="mt-1 text-sm text-gray-500">
                            Size: {{ (video.size / 1024 / 1024).toFixed(2) }} MB
                        </div>
                    </NuxtLink>
                </li>
            </ul>
            <div
                v-else
                class="text-center text-gray-500"
            >
                No videos found in this folder
            </div>
        </div>
    </div>
</template>
