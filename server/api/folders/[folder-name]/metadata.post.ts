import path from 'node:path'
import { parse, strictObject, string } from 'valibot'
import type { GameMetadata } from '~~/shared/utils/game-metadata'

const paramsSchema = strictObject({
    'folder-name': string(),
})
export default defineEventHandler(async (event): Promise<GameMetadata> => {
    const { 'folder-name': folderName } = await getValidatedRouterParams(
        event,
        (data) => parse(paramsSchema, data),
    )
    const { libraryPath } = useRuntimeConfig()
    const folderPath = path.join(libraryPath, folderName)

    const metadata = await getGameMetadata(folderName)
    await setMetadata(metadata, folderPath)

    return metadata
})
