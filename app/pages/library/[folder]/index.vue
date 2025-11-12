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
            <FolderTable
                v-if="folderData.videos.length > 0"
                :items="folderData.videos"
            />
            <div
                v-else
                class="text-center text-gray-500"
            >
                No videos found in this folder
            </div>
        </div>
    </div>
</template>
