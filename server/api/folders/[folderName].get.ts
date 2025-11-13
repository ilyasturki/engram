import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import * as v from 'valibot'
import type { Folder, Video } from '~~/shared/types/types'
import { folderParamsSchema } from '~~/shared/utils/folder-param'

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv']

export default defineEventHandler(async (event): Promise<Folder> => {
    try {
        const { folderName } = await getValidatedRouterParams(event, (data) =>
            v.parse(folderParamsSchema, data),
        )

        const { libraryPath } = useRuntimeConfig()

        const folderPath = path.join(libraryPath, folderName)
        // eslint-disable-next-line unicorn/no-useless-undefined
        const folderStat = await stat(folderPath).catch(() => undefined)

        if (!folderStat) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Folder not found',
            })
        }

        if (!folderStat.isDirectory()) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Path is not a folder',
            })
        }

        const files = await readdir(folderPath, { withFileTypes: true })
        const videoFiles = files.filter(
            (file) =>
                file.isFile()
                && VIDEO_EXTENSIONS.some((ext) =>
                    file.name.toLowerCase().endsWith(ext),
                ),
        )

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

        children.sort((a, b) => b.mtime.localeCompare(a.mtime))

        return {
            path: path.relative(libraryPath, folderPath),
            type: 'folder',
            mtime: folderStat.mtime.toISOString(),
            videos: children,
        }
    } catch (error) {
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to read folder',
            message: error instanceof Error ? error.message : 'Unknown error',
        })
    }
})
