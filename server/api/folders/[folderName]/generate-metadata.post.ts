import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'valibot'
import { fetchMetadata, METADATA_FILE_NAME } from '~~/server/utils/metadata'
import { folderParamsSchema } from '~~/shared/utils/folder-param'
import type { GameMetadata } from '~~/shared/utils/game-metadata'

export default defineEventHandler(async (event): Promise<GameMetadata> => {
    const { folderName } = await getValidatedRouterParams(event, (data) =>
        parse(folderParamsSchema, data),
    )

    const metadata = await fetchMetadata(folderName)

    const { libraryPath } = useRuntimeConfig()
    const folderPath = path.join(libraryPath, folderName)
    const metadataFilePath = path.join(folderPath, METADATA_FILE_NAME)

    const JSON_SPACE = 4
    await writeFile(
        metadataFilePath,
        JSON.stringify(metadata, undefined, JSON_SPACE),
        'utf8',
    )

    return metadata
})
