import type { FolderStructure } from '~~/shared/types/folder'

export function useFolders() {
    const { data, status, error, refresh } =
        useFetch<FolderStructure>('/api/folders')

    return {
        folders: data,
        loading: computed(() => status.value === 'pending'),
        error,
        refresh,
    }
}
