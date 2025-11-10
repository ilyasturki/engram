import path from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import type { FolderItem, FolderStructure } from '~~/shared/types/folder'
import { getVideoMimeType } from '~~/server/utils/path-validator'

const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mkv'])

function isVideoFile(filename: string): boolean {
    const ext = path.extname(filename).toLowerCase()
    return VIDEO_EXTENSIONS.has(ext)
}

async function getFolderItems(
    absolutePath: string,
    relativePath: string,
    depth: number,
): Promise<FolderItem[]> {
    const entries = await readdir(absolutePath, { withFileTypes: true })
    const items: FolderItem[] = []

    for (const entry of entries) {
        const entryAbsolutePath = path.join(absolutePath, entry.name)
        const entryRelativePath = path.join(relativePath, entry.name)

        if (entry.isDirectory()) {
            const folderItem: FolderItem = {
                name: entry.name,
                path: entryRelativePath,
                type: 'folder',
            }

            if (depth < 1) {
                folderItem.children = await getFolderItems(
                    entryAbsolutePath,
                    entryRelativePath,
                    depth + 1,
                )
            }

            items.push(folderItem)
        } else if (entry.isFile() && isVideoFile(entry.name)) {
            const fileStats = await stat(entryAbsolutePath)
            items.push({
                name: entry.name,
                path: entryRelativePath,
                type: 'file',
                size: fileStats.size,
                mimeType: getVideoMimeType(entry.name),
            })
        }
    }

    items.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name)
        }
        return a.type === 'folder' ? -1 : 1
    })

    return items
}

export default defineEventHandler(async (): Promise<FolderStructure> => {
    const config = useRuntimeConfig()
    const libraryPath =
        config.libraryPath || path.resolve(process.cwd(), 'samples')

    try {
        const libraryStats = await stat(libraryPath)
        if (!libraryStats.isDirectory()) {
            throw createError({
                statusCode: 500,
                message: 'Library path is not a directory',
            })
        }
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            throw createError({
                statusCode: 404,
                message: 'Library path not found',
            })
        }
        throw error
    }

    const items = await getFolderItems(libraryPath, '', 0)

    return { items }
})
