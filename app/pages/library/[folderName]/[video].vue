<script setup lang="ts">
const route = useRoute()
const folder = route.params.folderName as string
const video = route.params.video as string
const videoSrc = `/api/video/${folder}/${video}`
</script>

<template>
    <div class="min-h-screen p-4">
        <NuxtLink
            :to="`/library/${folder}`"
            class="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
            <Icon
                name="lucide:arrow-left"
                class="size-5"
            />
            <span>Back to folder</span>
        </NuxtLink>
        <div class="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <VideoPlayer :src="videoSrc" />
        </div>
    </div>
</template>
