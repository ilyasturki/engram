<script setup lang="ts">
useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk ? `${titleChunk} - Engram` : 'Engram'
    },
    htmlAttrs: {
        lang: 'en',
    },
    // link: [
    //     {
    //         rel: 'icon',
    //         type: 'image/svg+xml',
    //         href: '/favicon.svg',
    //     },
    // ],
})
</script>

<template>
    <NuxtLayout>
        <UApp>
            <NuxtPage />
        </UApp>
    </NuxtLayout>
</template>
