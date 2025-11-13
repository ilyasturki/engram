<script setup lang="ts">
const emit = defineEmits<{
    close: []
}>()
defineSlots<{
    default: []
}>()

const dialogEl = useTemplateRef('dialogRef')
function open() {
    dialogEl.value?.showModal()
}
function close() {
    dialogEl.value?.close()
    emit('close')
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <dialog
        ref="dialogRef"
        class="backdrop:bg-gray/50 fixed inset-0 m-auto h-fit max-h-[80vh] w-full max-w-md rounded-lg border border-gray-700 p-5 shadow-2xl backdrop:backdrop-blur-sm dark:bg-gray-900"
        closedby="any"
        @close="emit('close')"
    >
        <slot />
    </dialog>
</template>
