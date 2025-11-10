<script setup lang="ts">
import type { FolderItem, FolderStructure } from '~~/shared/types/folder'

const {
    data: folders,
    status,
    error,
} = useFetch<FolderStructure>('/api/folders')
const loading = computed(() => status.value === 'pending')

const currentPath = ref<string[]>([])

const currentItems = computed(() => {
    if (!folders.value?.items) return []

    let { items } = folders.value

    for (const pathSegment of currentPath.value) {
        const folder = items.find(
            (item) => item.type === 'folder' && item.name === pathSegment,
        )
        if (folder?.children) {
            items = folder.children
        } else {
            return []
        }
    }

    return items.toSorted((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name)
        }
        return a.type === 'folder' ? -1 : 1
    })
})

function navigateToFolder(item: FolderItem) {
    if (item.type === 'folder') {
        currentPath.value.push(item.name)
    }
}

function navigateUp() {
    currentPath.value.pop()
}

function playVideo(item: FolderItem) {
    if (item.type === 'file') {
        console.log('Playing video:', item.path)
    }
}
</script>

<template>
    <div class="min-h-screen p-4">
        <div class="mx-auto max-w-7xl">
            <UHeader
                v-if="currentPath.length > 0"
                :title="currentPath[currentPath.length - 1]"
                class="mb-4"
            />

            <div
                v-if="currentPath.length > 0"
                class="mb-4"
            >
                <UButton
                    variant="ghost"
                    @click="navigateUp"
                >
                    ← Back
                </UButton>
            </div>

            <div
                v-if="loading"
                class="text-center"
            >
                <p class="text-gray-500">Loading...</p>
            </div>

            <div
                v-else-if="error"
                class="text-center"
            >
                <p class="text-red-500">Error loading folders: {{ error }}</p>
            </div>

            <div
                v-else-if="currentItems.length === 0"
                class="text-center"
            >
                <p class="text-gray-500">No items found</p>
            </div>

            <UPageGrid v-else>
                <UCard
                    v-for="item in currentItems"
                    :key="item.path"
                    class="cursor-pointer transition-shadow hover:shadow-xl"
                    @click="
                        item.type === 'folder' ?
                            navigateToFolder(item)
                        :   playVideo(item)
                    "
                >
                    <div
                        class="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-100"
                    >
                        <div class="text-center">
                            <div class="text-6xl">
                                {{ item.type === 'folder' ? '📁' : '📄' }}
                            </div>
                        </div>
                    </div>
                    <template #header>
                        <h3 class="truncate text-sm font-medium">
                            {{ item.name }}
                        </h3>
                    </template>
                    <template
                        v-if="item.type === 'file'"
                        #footer
                    >
                        <div
                            class="flex items-center justify-between text-xs text-gray-500"
                        >
                            <span>{{ formatFileSize(item.size) }}</span>
                        </div>
                    </template>
                </UCard>
            </UPageGrid>
        </div>
    </div>
</template>
