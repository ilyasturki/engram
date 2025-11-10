<script setup lang="ts">
const videoSrc = '/api/video/game-a/file_example_MP4_1920_18MG.mp4'
</script>

<template>
    <div class="flex min-h-screen items-center justify-center p-4">
        <VideoPlayer :src="videoSrc" />
    </div>
</template>
