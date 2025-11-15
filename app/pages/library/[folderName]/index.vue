<script setup lang="ts">
import type { Folder } from '#imports'
import GameMetadataDialog from '~/components/game-metadata-dialog.vue'
import RenameFolderDialog from '~/components/rename-folder-dialog.vue'
import { folderParamsSchema } from '~~/shared/utils/folder-param'

const { folderName } = useValidatedRouteParams(folderParamsSchema)

const { data: folderData, error } = await useFetch<Folder>(
    `/api/folders/${folderName}`,
)

const gameMetadataDialog = useTemplateRef('gameMetadataDialog')
function openGameMetadataDialog() {
    gameMetadataDialog.value?.open()
}

const renameFolderDialog = useTemplateRef('renameFolderDialog')
function openRenameFolderDialog() {
    renameFolderDialog.value?.open()
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
                <div class="flex items-center gap-3">
                    <button
                        type="button"
                        class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                        @click="openRenameFolderDialog"
                    >
                        <Icon
                            name="lucide:pencil"
                            class="size-4"
                        />
                        <span>Rename</span>
                    </button>
                    <button
                        type="button"
                        class="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                        @click="openGameMetadataDialog"
                    >
                        Edit Metadata
                    </button>
                </div>
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

        <RenameFolderDialog
            ref="renameFolderDialog"
            :folder-name
        />
        <GameMetadataDialog
            ref="gameMetadataDialog"
            :folder-name
        />
    </div>
</template>
