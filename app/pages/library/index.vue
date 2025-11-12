<script setup lang="ts">
const { data: folders, error } = useFetch('/api/folders')
</script>

<template>
    <div
        v-if="error"
        class="text-center"
    >
        <p class="text-red-500">Error loading folders: {{ error }}</p>
    </div>
    <ul v-else>
        <li>
            <NuxtLink
                v-for="folder in folders"
                :key="folder.path"
                :to="`/library/${folder.path}`"
            >
                {{ folder.path }}
            </NuxtLink>
        </li>
    </ul>
</template>
