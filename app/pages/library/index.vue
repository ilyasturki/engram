<script setup lang="ts">
const { data: folders, status, error } = useFetch('/api/folders')
</script>

<template>
    <div
        v-if="error"
        class="p-8 text-center"
    >
        <p class="text-red-500">Error loading folders: {{ error }}</p>
    </div>
    <div v-else-if="status === 'pending' || folders === undefined">
        <p class="text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
    <Table
        v-else
        :items="folders"
    />
</template>
