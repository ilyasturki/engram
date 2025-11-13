import path from 'node:path'
import { parse } from 'valibot'
import { folderParamsSchema } from '~~/shared/utils/folder-param'
import type { GameMetadata } from '~~/shared/utils/game-metadata'

export default defineEventHandler(async (event): Promise<GameMetadata> => {
    const { folderName } = await getValidatedRouterParams(event, (data) =>
        parse(folderParamsSchema, data),
    )
    const { libraryPath } = useRuntimeConfig()
    const folderPath = path.join(libraryPath, folderName)

    const metadata = await getGameMetadata(folderName)
    await setMetadata(metadata, folderPath)

    return metadata
})
