<script setup lang="ts">
const { data: folders, error } = useFetch('/api/folders')
</script>

<template>
    <div class="min-h-screen p-4">
        <div
            v-if="error"
            class="p-8 text-center"
        >
            <p class="text-red-500">Error loading folders: {{ error }}</p>
        </div>
        <div
            v-else
            class="mx-auto max-w-7xl"
        >
            <div
                class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
                <div
                    class="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600"
                >
                    <div class="w-10"></div>
                    <div>Name</div>
                    <div class="hidden min-w-32 text-right sm:block">
                        Modified
                    </div>
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
                        <Folder :size="20" />
                    </div>
                    <div
                        class="flex items-center truncate font-medium text-gray-900"
                    >
                        {{ folder.path }}
                    </div>
                    <div
                        class="hidden min-w-32 items-center justify-end text-sm text-gray-500 sm:flex"
                    >
                        {{ folder.mtime }}
                    </div>
                    <div
                        class="flex min-w-20 items-center justify-end text-sm text-gray-500"
                    >
                        {{ folder.videos.length }}
                    </div>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
