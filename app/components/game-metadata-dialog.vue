<script setup lang="ts">
import type { GameMetadata } from '~~/shared/utils/game-metadata'

const props = defineProps<{
    folderName: string
}>()

const dialogEl = useTemplateRef('dialogRef')

function submit(metadata: GameMetadata) {
    // eslint-disable-next-line no-console
    console.log('Success:', metadata)
    dialogEl.value?.close()
}

const { refresh, status, error } = useFetch(
    `/api/folders/${props.folderName}/metadata`,
    {
        immediate: false,
        method: 'POST',
    },
)

defineExpose({
    open: () => dialogEl.value?.open(),
    close: () => dialogEl.value?.close(),
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
                :disabled="status === 'pending'"
                class="mt-2 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                @click="refresh()"
            >
                {{ status === 'pending' ? 'Refreshing...' : 'Refresh' }}
            </button>
            <p
                v-if="status === 'error'"
                class="mt-2 text-sm text-red-500"
            >
                {{ error?.statusMessage || 'An error occurred' }}
            </p>
        </div>
        <GameMetadataForm @submit="submit" />
    </Dialog>
</template>
