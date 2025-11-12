<script setup lang="ts">
interface Props {
    src: string
}

const props = defineProps<Props>()
</script>

<template>
    <!-- eslint-disable-next-line vue-a11y/media-has-caption -->
    <video
        :src="props.src"
        controls
        class="w-full max-w-4xl rounded-lg shadow-lg"
    >
        Your browser does not support the video tag.
    </video>
</template>
