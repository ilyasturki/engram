<script setup lang="ts">
import type { GameMetadata } from '~~/shared/utils/game-metadata'

const props = defineProps<{
    folderName: string
}>()

const dialogEl = useTemplateRef('dialogRef')

// eslint-disable-next-line vue/define-macros-order
defineExpose({
    open: () => dialogEl.value?.open(),
    close: () => dialogEl.value?.close(),
})

const { data: metadata } = await useFetch(
    `/api/folders/${props.folderName}/metadata`,
)

function submit(gameMetadata: GameMetadata) {
    // eslint-disable-next-line no-console
    console.log('Success:', gameMetadata)
    dialogEl.value?.close()
}

const {
    refresh,
    status: refreshStatus,
    error: refreshError,
} = useFetch(`/api/folders/${props.folderName}/metadata`, {
    immediate: false,
    method: 'POST',
})
</script>

<template>
    <Dialog ref="dialogRef">
        <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                Edit Game Metadata
            </h2>
            <button
                type="button"
                :disabled="refreshStatus === 'pending'"
                class="mt-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                @click="refresh()"
            >
                {{ refreshStatus === 'pending' ? 'Refreshing...' : 'Refresh' }}
            </button>
            <p
                v-if="refreshStatus === 'error'"
                class="mt-2 text-sm text-red-500"
            >
                {{ refreshError?.statusMessage || 'An error occurred' }}
            </p>
        </div>
        <GameMetadataForm
            :initial-data="metadata"
            @submit="submit"
        />
    </Dialog>
</template>
