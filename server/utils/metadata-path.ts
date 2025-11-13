import path from 'node:path'
import { mkdir } from 'node:fs/promises'

export async function getMetadataPath(): Promise<string> {
    const config = useRuntimeConfig()
    const libraryPath =
        config.libraryPath || path.resolve(process.cwd(), 'samples')
    const metadataPath =
        config.metadataPath || path.join(libraryPath, '.metadata')

    try {
        await mkdir(metadataPath, { recursive: true })
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Failed to create metadata directory: ${error}`,
        })
    }

    return metadataPath
}
