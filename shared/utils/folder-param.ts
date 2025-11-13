import * as v from 'valibot'

const MAX_FOLDER_NAME_LENGTH = 255

export const folderParamsSchema = v.pipe(
    v.strictObject({
        'folder-name': v.pipe(
            v.string(),
            v.trim(),
            v.minLength(1),
            v.maxLength(MAX_FOLDER_NAME_LENGTH),
        ),
    }),
    v.transform((params) => ({
        folderName: params['folder-name'],
    })),
)
