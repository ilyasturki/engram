import { parse } from 'valibot'
import { readFile } from 'node:fs/promises'
import { METADATA_FILE_NAME } from '~~/server/utils/metadata'
import { folderParamsSchema } from '~~/shared/utils/folder-param'
import type { GameMetadata } from '~~/shared/utils/game-metadata'
import { gameMetadataSchema } from '~~/shared/utils/game-metadata'
import path from 'node:path'

export default defineEventHandler(async (event): Promise<GameMetadata> => {
    const { folderName } = await getValidatedRouterParams(event, (data) =>
        parse(folderParamsSchema, data),
    )

    const { libraryPath } = useRuntimeConfig()
    const folderPath = path.join(libraryPath, folderName)
    const metadataFilePath = path.join(folderPath, METADATA_FILE_NAME)

    const fileContent = await readFile(metadataFilePath, 'utf8')
    const parsedData = JSON.parse(fileContent)

    return parse(gameMetadataSchema, parsedData)
})
