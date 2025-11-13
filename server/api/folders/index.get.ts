import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import type { Folder, Video } from '~~/shared/types/types'

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv']

export default defineEventHandler(async (): Promise<Folder[]> => {
    try {
        const { libraryPath } = useRuntimeConfig()

        const entries = await readdir(libraryPath, { withFileTypes: true })
        const folders = entries.filter(
            (entry) => entry.isDirectory() && !entry.name.startsWith('.'),
        )

        const gameFolders: Folder[] = []

        for (const folderEntry of folders) {
            const folderPath = path.join(libraryPath, folderEntry.name)
            const folderStat = await stat(folderPath)

            const files = await readdir(folderPath, { withFileTypes: true })
            const videoFiles = files.filter(
                (file) =>
                    file.isFile()
                    && VIDEO_EXTENSIONS.some((ext) =>
                        file.name.toLowerCase().endsWith(ext),
                    ),
            )

            if (videoFiles.length === 0) {
                continue
            }

            const children: Video[] = []
            for (const videoFile of videoFiles) {
                const videoPath = path.join(folderPath, videoFile.name)
                const videoStat = await stat(videoPath)
                const relativePath = path.relative(libraryPath, videoPath)

                children.push({
                    type: 'video',
                    path: relativePath,
                    size: videoStat.size,
                    mtime: videoStat.mtime.toISOString(),
                })
            }

            gameFolders.push({
                path: path.relative(libraryPath, folderPath),
                type: 'folder',
                mtime: folderStat.mtime.toISOString(),
                videos: children,
            })
        }

        gameFolders.sort((a, b) => b.mtime.localeCompare(a.mtime))

        return gameFolders
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to read folders',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})
