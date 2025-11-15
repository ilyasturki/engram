<script setup lang="ts">
import * as v from 'valibot'
import { folderNameSchema } from '~~/shared/utils/folder-param'

const props = defineProps<{
    folderName: string
}>()

const dialogEl = useTemplateRef('dialogRef')

const newFolderName = ref(props.folderName)
const error = ref('')
const isSubmitting = ref(false)

function validateFolderName() {
    try {
        v.parse(folderNameSchema, newFolderName.value)
        error.value = ''
        return true
    } catch (error_) {
        if (error_ instanceof v.ValiError) {
            error.value = error_.issues[0]?.message ?? 'Invalid folder name'
        }
        return false
    }
}

async function handleSubmit() {
    error.value = ''

    if (!validateFolderName()) {
        return
    }

    if (newFolderName.value === props.folderName) {
        error.value = 'New folder name must be different from the current name'
        return
    }

    isSubmitting.value = true

    try {
        await $fetch(
            `/api/folders/${props.folderName as 'folderName'}/rename`,
            {
                method: 'PUT',
                body: { newName: newFolderName.value },
            },
        )

        await navigateTo(`/library/${newFolderName.value}`)
        dialogEl.value?.close()
    } catch (error_) {
        error.value =
            error_ instanceof Error ? error_.message : 'Failed to rename folder'
    } finally {
        isSubmitting.value = false
    }
}

defineExpose({
    open: () => {
        newFolderName.value = props.folderName
        error.value = ''
        dialogEl.value?.open()
    },
    close: () => dialogEl.value?.close(),
})
</script>

<template>
    <Dialog ref="dialogRef">
        <div class="mb-4">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
                Rename Folder
            </h2>
        </div>

        <form
            class="space-y-6"
            @submit.prevent="handleSubmit"
        >
            <div>
                <label
                    for="newFolderName"
                    class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                    New Folder Name
                </label>
                <input
                    id="newFolderName"
                    v-model="newFolderName"
                    type="text"
                    class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                    @blur="validateFolderName"
                />
                <p
                    v-if="error"
                    class="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                    {{ error }}
                </p>
            </div>

            <div class="flex gap-3">
                <button
                    type="button"
                    class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                    @click="dialogEl?.close()"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    :disabled="isSubmitting"
                    class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                >
                    {{ isSubmitting ? 'Renaming...' : 'Rename' }}
                </button>
            </div>
        </form>
    </Dialog>
</template>
