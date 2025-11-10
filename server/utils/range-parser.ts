export interface ByteRange {
    start: number
    end: number
}

export function parseRangeHeader(
    rangeHeader: string,
    fileSize: number,
): ByteRange {
    const rangeMatch = rangeHeader.match(/bytes=(\d*)-(\d*)/u)

    if (!rangeMatch) {
        throw createError({
            statusCode: 416,
            message: 'Invalid Range header format',
        })
    }

    const [_, startStr, endStr] = rangeMatch

    let start: number
    let end: number

    if (startStr === '' && endStr === '') {
        throw createError({
            statusCode: 416,
            message: 'Invalid Range header: both start and end are empty',
        })
    }

    if (startStr === '') {
        start = Math.max(0, fileSize - Number.parseInt(endStr, 10))
        end = fileSize - 1
    } else if (endStr === '') {
        start = Number.parseInt(startStr, 10)
        end = fileSize - 1
    } else {
        start = Number.parseInt(startStr, 10)
        end = Number.parseInt(endStr, 10)
    }

    if (start < 0 || end >= fileSize || start > end) {
        throw createError({
            statusCode: 416,
            message: 'Range not satisfiable',
        })
    }

    return { start, end }
}
