import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import * as v from 'valibot'
import { getVideoMimeType } from '~~/server/utils/path-validator'
import { parseRangeHeader } from '~~/server/utils/range-parser'
import { videoParamsSchema } from '~~/shared/utils/folder-param'

export default defineEventHandler(async (event) => {
    const { folderName, videoName } = await getValidatedRouterParams(
        event,
        (data) => v.parse(videoParamsSchema, data),
    )

    const { libraryPath } = useRuntimeConfig()
    const videoPath = path.join(libraryPath, folderName, videoName)
    const { size: fileSize } = await stat(videoPath)

    const rangeHeader = getHeader(event, 'range')
    if (!rangeHeader) {
        throw createError({
            statusCode: 400,
            message: 'Range header is required for video streaming',
        })
    }
    const { start, end } = parseRangeHeader(rangeHeader, fileSize)

    const contentLength = end - start + 1

    const PARTIAL_CONTENT_STATUS = 206
    setResponseStatus(event, PARTIAL_CONTENT_STATUS)
    setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`)
    setHeader(event, 'Content-Length', contentLength)
    setHeader(event, 'Content-Type', getVideoMimeType(videoPath))
    setHeader(event, 'Accept-Ranges', 'bytes')

    const stream = createReadStream(videoPath, { start, end })

    return sendStream(event, stream)
})
