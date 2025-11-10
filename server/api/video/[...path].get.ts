import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import * as v from 'valibot'
import {
    getValidatedVideoPath,
    getVideoMimeType,
} from '~~/server/utils/path-validator'
import { parseRangeHeader } from '~~/server/utils/range-parser'

const paramsSchema = v.strictObject({
    path: v.string(),
})

export default defineEventHandler(async (event) => {
    const { path } = await getValidatedRouterParams(event, (data) =>
        v.parse(paramsSchema, data),
    )

    const videoPath = await getValidatedVideoPath(path)
    const fileStats = await stat(videoPath)
    const fileSize = fileStats.size

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
