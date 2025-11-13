<script setup lang="ts">
const dialogRef = ref<HTMLDialogElement | null>(null)

const emit = defineEmits<{
    close: []
}>()

function open() {
    dialogRef.value?.showModal()
}

function close() {
    dialogRef.value?.close()
    emit('close')
}

function handleBackdropClick(event: MouseEvent) {
    if (event.target === dialogRef.value) {
        close()
    }
}

defineExpose({
    open,
    close,
})
</script>

<template>
    <dialog
        ref="dialogRef"
        class="rounded-lg border border-gray-200 bg-white p-6 shadow-xl backdrop:bg-black/50 dark:border-gray-700 dark:bg-gray-800"
        @click="handleBackdropClick"
        @close="emit('close')"
    >
        <div class="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
            <slot />
        </div>
    </dialog>
</template>

<style scoped>
dialog {
    animation: dialog-fade-in 0.2s ease-out;
}

dialog::backdrop {
    animation: backdrop-fade-in 0.2s ease-out;
}

@keyframes dialog-fade-in {
    from {
        opacity: 0;
        transform: translateY(-1rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes backdrop-fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
