import { rename } from 'node:fs/promises'
import path from 'node:path'
import * as v from 'valibot'
import {
    folderNameSchema,
    folderParamsSchema,
} from '~~/shared/utils/folder-param'

const renameRequestSchema = v.strictObject({
    newName: folderNameSchema,
})

export default defineEventHandler(async (event) => {
    const { folderName } = await getValidatedRouterParams(event, (data) =>
        v.parse(folderParamsSchema, data),
    )
    const { newName } = await readValidatedBody(event, (data) =>
        v.parse(renameRequestSchema, data),
    )

    if (folderName === newName) {
        return
    }

    const { libraryPath } = useRuntimeConfig()
    const currentFolderPath = path.join(libraryPath, folderName)
    const newFolderPath = path.join(libraryPath, newName)

    await rename(currentFolderPath, newFolderPath)
})
