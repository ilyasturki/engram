import * as v from 'valibot'

const MAX_NAME_LENGTH = 255
const NULL_BYTE = 0
const MAX_CONTROL_CHAR = 31
const DEL_CHAR = 127

export const folderParamsSchema = v.pipe(
    v.strictObject({
        folderName: v.pipe(
            v.string(),
            v.trim(),
            v.minLength(1),
            v.maxLength(MAX_NAME_LENGTH),
            v.check((input) => {
                for (const char of input) {
                    const code = char.codePointAt(0)
                    if (char === '/' || char === '\\') return false
                    if (code === NULL_BYTE) return false
                    if (
                        code !== undefined
                        && (code <= MAX_CONTROL_CHAR || code === DEL_CHAR)
                    )
                        return false
                }
                return true
            }, 'Folder name contains forbidden characters (path separators, null bytes, or control characters)'),
            v.check(
                (input) => input !== '.' && input !== '..',
                'Folder name cannot be "." or ".."',
            ),
            v.check(
                (input) => !input.startsWith('.'),
                'Folder name cannot start with a dot (hidden folders not allowed)',
            ),
        ),
    }),
)

export const videoParamsSchema = v.pipe(
    v.strictObject({
        folderName: v.pipe(
            v.string(),
            v.trim(),
            v.minLength(1),
            v.maxLength(MAX_NAME_LENGTH),
            v.check((input) => {
                for (const char of input) {
                    const code = char.codePointAt(0)
                    if (char === '/' || char === '\\') return false
                    if (code === NULL_BYTE) return false
                    if (
                        code !== undefined
                        && (code <= MAX_CONTROL_CHAR || code === DEL_CHAR)
                    )
                        return false
                }
                return true
            }, 'Folder name contains forbidden characters (path separators, null bytes, or control characters)'),
            v.check(
                (input) => input !== '.' && input !== '..',
                'Folder name cannot be "." or ".."',
            ),
            v.check(
                (input) => !input.startsWith('.'),
                'Folder name cannot start with a dot (hidden folders not allowed)',
            ),
        ),
        videoName: v.pipe(
            v.string(),
            v.trim(),
            v.minLength(1),
            v.maxLength(MAX_NAME_LENGTH),
            v.check((input) => {
                for (const char of input) {
                    const code = char.codePointAt(0)
                    if (char === '/' || char === '\\') return false
                    if (code === NULL_BYTE) return false
                    if (
                        code !== undefined
                        && (code <= MAX_CONTROL_CHAR || code === DEL_CHAR)
                    )
                        return false
                }
                return true
            }, 'Video name contains forbidden characters (path separators, null bytes, or control characters)'),
            v.check(
                (input) => input !== '.' && input !== '..',
                'Video name cannot be "." or ".."',
            ),
            v.check(
                (input) => !input.startsWith('.'),
                'Video name cannot start with a dot (hidden folders not allowed)',
            ),
        ),
    }),
)
