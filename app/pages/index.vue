<script setup lang="ts">
const videoSrc = '/api/video/file_example_MP4_1920_18MG.mp4'
</script>

<template>
    <div class="flex min-h-screen items-center justify-center p-4">
        <!-- eslint-disable-next-line vue-a11y/media-has-caption -->
        <video
            :src="videoSrc"
            controls
            class="w-full max-w-4xl rounded-lg shadow-lg"
        >
            Your browser does not support the video tag.
        </video>
    </div>
</template>
