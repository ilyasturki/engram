import * as v from 'valibot'
import type { GameMetadata } from '~~/shared/utils/game-metadata'
import { gameMetadataSchema } from '~~/shared/utils/game-metadata'

export async function fetchMetadata(gameName: string): Promise<GameMetadata> {
    const { rawgApi } = useRuntimeConfig()

    const searchUrl = new URL('https://api.rawg.io/api/games')
    searchUrl.searchParams.set('key', rawgApi)
    searchUrl.searchParams.set('search', gameName)
    searchUrl.searchParams.set('page_size', '1')

    let response: Response
    try {
        response = await fetch(searchUrl.toString())
    } catch (error) {
        throw createError({
            statusCode: 502,
            statusMessage: `Failed to connect to RAWG API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        })
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw createError({
                statusCode: 502,
                statusMessage:
                    'Invalid RAWG API key. Please check your NUXT_RAWG_API environment variable.',
            })
        }
        throw createError({
            statusCode: 502,
            statusMessage: `RAWG API request failed with status ${response.status}: ${response.statusText}`,
        })
    }

    let data: RawgApiResponse
    try {
        data = await response.json()
    } catch {
        throw createError({
            statusCode: 502,
            statusMessage: 'Failed to parse RAWG API response as JSON',
        })
    }

    if (!data.results || data.results.length === 0) {
        throw createError({
            statusCode: 204,
            statusMessage: `No game found with name: "${gameName}"`,
        })
    }

    const [game] = data.results

    if (!game.name || !game.released) {
        throw createError({
            statusCode: 500,
            statusMessage:
                'Game data is incomplete. Missing required fields (name or releaseDate).',
        })
    }

    const gameMetadata: GameMetadata = {
        title: game.name,
        platform:
            game.platforms?.map((p) => p.platform.name).join(', ') || 'Unknown',
        releaseDate: game.released,
        developer: game.developers?.[0]?.name || 'Unknown',
        publisher: game.publishers?.[0]?.name || 'Unknown',
        genre: game.genres?.map((g) => g.name) || [],
    }

    try {
        return v.parse(gameMetadataSchema, gameMetadata)
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to validate game metadata: ${error instanceof Error ? error.message : 'Unknown validation error'}`,
        })
    }
}

interface RawgPlatform {
    platform: {
        id: number
        name: string
        slug: string
    }
}

interface RawgDeveloper {
    id: number
    name: string
    slug: string
}

interface RawgPublisher {
    id: number
    name: string
    slug: string
}

interface RawgGenre {
    id: number
    name: string
    slug: string
}

interface RawgGame {
    id: number
    name: string
    description: string
    released: string
    platforms: RawgPlatform[]
    developers: RawgDeveloper[]
    publishers: RawgPublisher[]
    genres: RawgGenre[]
}

interface RawgApiResponse {
    count: number
    next: string | null
    previous: string | null
    results: RawgGame[]
}

export const METADATA_FILE_NAME = 'metadata.json'
