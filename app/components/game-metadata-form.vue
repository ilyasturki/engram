<script setup lang="ts">
import * as v from 'valibot'
import { gameMetadataSchema } from '~~/shared/utils/game-metadata'
import type { GameMetadata } from '~~/shared/utils/game-metadata'

const formData = defineModel<GameMetadata>({
    default: {
        title: '',
        platform: '',
        releaseDate: '',
        developer: '',
        publisher: '',
        genre: [],
    },
})

const emit = defineEmits<{
    submit: [metadata: GameMetadata]
}>()

const errors = reactive<Record<keyof GameMetadata, string>>({
    title: '',
    platform: '',
    releaseDate: '',
    developer: '',
    publisher: '',
    genre: '',
})
const isSubmitting = ref(false)
const newGenre = ref('')

function validateField(field: keyof GameMetadata) {
    try {
        const fieldSchema = gameMetadataSchema.entries[field]
        if (fieldSchema) {
            v.parse(fieldSchema, formData.value[field])
            errors[field] = ''
        }
    } catch (error) {
        if (error instanceof v.ValiError) {
            errors[field] = error.issues[0]?.message ?? 'Invalid value'
        }
    }
}

function addGenre() {
    const trimmedGenre = newGenre.value.trim()
    if (trimmedGenre && !formData.value.genre.includes(trimmedGenre)) {
        formData.value.genre.push(trimmedGenre)
        newGenre.value = ''
    }
}

function removeGenre(index: number) {
    formData.value.genre.splice(index, 1)
}

function handleSubmit() {
    for (const key of Object.keys(errors) as (keyof GameMetadata)[]) {
        errors[key] = ''
    }

    try {
        const validatedData = v.parse(gameMetadataSchema, formData.value)
        isSubmitting.value = true
        emit('submit', validatedData)
    } catch (error) {
        if (error instanceof v.ValiError) {
            for (const issue of error.issues) {
                const path = issue.path?.[0]?.key as keyof GameMetadata
                if (path && typeof path === 'string') {
                    errors[path] = issue.message
                }
            }
        }
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <form
        class="space-y-6"
        @submit.prevent="handleSubmit"
    >
        <div>
            <label
                for="title"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
                Title
            </label>
            <input
                id="title"
                v-model="formData.title"
                type="text"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                @blur="validateField('title')"
            />
            <p
                v-if="errors.title"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
                {{ errors.title }}
            </p>
        </div>

        <div>
            <label
                for="platform"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
                Platform
            </label>
            <input
                id="platform"
                v-model="formData.platform"
                type="text"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                @blur="validateField('platform')"
            />
            <p
                v-if="errors.platform"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
                {{ errors.platform }}
            </p>
        </div>

        <div>
            <label
                for="releaseDate"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
                Release Date
            </label>
            <input
                id="releaseDate"
                v-model="formData.releaseDate"
                type="date"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                @blur="validateField('releaseDate')"
            />
            <p
                v-if="errors.releaseDate"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
                {{ errors.releaseDate }}
            </p>
        </div>

        <div>
            <label
                for="developer"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
                Developer
            </label>
            <input
                id="developer"
                v-model="formData.developer"
                type="text"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                @blur="validateField('developer')"
            />
            <p
                v-if="errors.developer"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
                {{ errors.developer }}
            </p>
        </div>

        <div>
            <label
                for="publisher"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
                Publisher
            </label>
            <input
                id="publisher"
                v-model="formData.publisher"
                type="text"
                class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                @blur="validateField('publisher')"
            />
            <p
                v-if="errors.publisher"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
                {{ errors.publisher }}
            </p>
        </div>

        <div>
            <label
                for="genre"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
            >
                Genres
            </label>
            <div class="mb-3 flex gap-2">
                <input
                    id="genre"
                    v-model="newGenre"
                    type="text"
                    placeholder="Add a genre"
                    class="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors focus:border-gray-400 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
                    @keydown.enter.prevent="addGenre"
                />
                <button
                    type="button"
                    class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
                    @click="addGenre"
                >
                    Add
                </button>
            </div>
            <div
                v-if="formData.genre.length > 0"
                class="flex flex-wrap gap-2"
            >
                <span
                    v-for="(genre, index) in formData.genre"
                    :key="index"
                    class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
                >
                    {{ genre }}
                    <button
                        type="button"
                        class="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        @click="removeGenre(index)"
                    >
                        <Icon
                            name="lucide:x"
                            class="size-4"
                        />
                    </button>
                </span>
            </div>
            <p
                v-if="errors.genre"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
            >
                {{ errors.genre }}
            </p>
        </div>

        <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600"
        >
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
    </form>
</template>
