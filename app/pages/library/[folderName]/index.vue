<script setup lang="ts">
import type * as v from 'valibot'
import type { Folder } from '#imports'
import type { GameMetadataSchema } from '~~/shared/utils/game-metadata'
import { folderParamsSchema } from '~~/shared/utils/folder-param'

const { folderName } = useValidatedRouteParams(folderParamsSchema)

const { data: folderData, error } = await useFetch<Folder>(
    `/api/folders/${folderName}`,
)

const dialogEl = useTemplateRef('dialogRef')
const isRefreshing = ref(false)
const refreshError = ref<string | undefined>()

function openMetadataDialog() {
    dialogEl.value?.open()
}

async function refreshMetadata() {
    isRefreshing.value = true
    refreshError.value = undefined

    try {
        await $fetch(`/api/folders/${folderName}/metadata`, {
            method: 'POST',
        })
    } catch (error_) {
        refreshError.value =
            error_ instanceof Error ?
                error_.message
            :   'Failed to refresh metadata'
    } finally {
        isRefreshing.value = false
    }
}

function handleMetadataSubmit(
    metadata: v.InferOutput<typeof GameMetadataSchema>,
) {
    console.log('Success:', metadata)
    dialogEl.value?.close()
}
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
            <header class="mb-6 flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {{ folderData.path }}
                </h1>
                <button
                    type="button"
                    class="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                    @click="openMetadataDialog"
                >
                    Edit Metadata
                </button>
            </header>

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

        <Dialog ref="dialogRef">
            <div class="mb-4">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Edit Game Metadata
                </h2>
                <button
                    type="button"
                    :disabled="isRefreshing"
                    class="mt-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                    @click="refreshMetadata"
                >
                    {{ isRefreshing ? 'Refreshing...' : 'Refresh from RAWG' }}
                </button>
                <p
                    v-if="refreshError"
                    class="mt-2 text-sm text-red-500"
                >
                    {{ refreshError }}
                </p>
            </div>
            <GameMetadataForm @submit="handleMetadataSubmit" />
        </Dialog>
    </div>
</template>
