<script setup lang="ts">
import type { Folder } from '#imports'

const route = useRoute()
const { folder } = route.params
if (folder === undefined || folder === '') {
    navigateTo('/library')
}

const { data: folderData, error } = await useFetch<Folder>(
    `/api/folders/${folder}`,
)
</script>

<template>
    <div class="p-4">
        <NuxtLink
            to="/library"
            class="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
            <Icon
                name="lucide:arrow-left"
                class="size-5"
            />
            <span>Back to library</span>
        </NuxtLink>
        <div
            v-if="error"
            class="text-center"
        >
            <p class="text-red-500">
                Error loading folder: {{ error.message }}
            </p>
        </div>
        <div v-else-if="folderData">
            <h1
                class="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100"
            >
                {{ folderData.path }}
            </h1>
            <Table
                v-if="folderData.videos.length > 0"
                :items="folderData.videos"
            />
            <div
                v-else
                class="text-center text-gray-500 dark:text-gray-400"
            >
                No videos found in this folder
            </div>
        </div>
    </div>
</template>
