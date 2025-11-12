<script setup lang="ts">
const route = useRoute()
const folder = route.params.folder as string
const video = route.params.video as string
const videoSrc = `/api/video/${folder}/${video}`
</script>

<template>
    <div class="flex min-h-screen items-center justify-center p-4">
        <VideoPlayer :src="videoSrc" />
    </div>
</template>
