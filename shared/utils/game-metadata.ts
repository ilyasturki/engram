import * as v from 'valibot'

export const GameMetadataSchema = v.strictObject({
    title: v.pipe(v.string(), v.minLength(1, 'Title is required')),
    platform: v.pipe(v.string(), v.minLength(1, 'Platform is required')),
    releaseDate: v.pipe(
        v.string(),
        v.isoDate('Release date must be in ISO format (YYYY-MM-DD)'),
    ),
    developer: v.pipe(v.string(), v.minLength(1, 'Developer is required')),
    publisher: v.pipe(v.string(), v.minLength(1, 'Publisher is required')),
    genre: v.array(v.string()),
})

export type GameMetadata = v.InferOutput<typeof GameMetadataSchema>
