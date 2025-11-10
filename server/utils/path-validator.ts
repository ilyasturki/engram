import path from 'node:path'
import { stat } from 'node:fs/promises'

export async function getValidatedVideoPath(
    requestedPath: string,
): Promise<string> {
    const config = useRuntimeConfig()
    const libraryPath =
        config.libraryPath || path.resolve(process.cwd(), 'samples')

    const normalizedPath = path
        .normalize(requestedPath)
        .replace(/^(\.\.(\/|\\|$))+/u, '')
    const absolutePath = path.join(libraryPath, normalizedPath)

    if (!absolutePath.startsWith(libraryPath)) {
        throw createError({
            statusCode: 403,
            message: 'Access denied: Path is outside the allowed directory',
        })
    }

    try {
        const fileStats = await stat(absolutePath)
        if (!fileStats.isFile()) {
            throw createError({
                statusCode: 400,
                message: 'Path is not a file',
            })
        }
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            throw createError({
                statusCode: 404,
                message: 'Video file not found',
            })
        }
        throw error
    }

    return absolutePath
}

export function getVideoMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop()
    const mimeTypes: Record<string, string> = {
        mp4: 'video/mp4',
        webm: 'video/webm',
        mkv: 'video/x-matroska',
    }
    return mimeTypes[ext || ''] || 'application/octet-stream'
}
