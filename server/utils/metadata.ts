import * as v from 'valibot'
import type { GameMetadata } from '~~/shared/utils/game-metadata'
import { GameMetadataSchema } from '~~/shared/utils/game-metadata'

export async function getGameMetadata(gameName: string): Promise<GameMetadata> {
    const { rawgApi } = useRuntimeConfig()
    if (!rawgApi) {
        throw createError({
            statusCode: 500,
            message: 'NUXT_RAWG_API environment variable is not configured.',
        })
    }

    if (!gameName || gameName.trim().length === 0) {
        throw createError({
            statusCode: 400,
            message: 'Game name cannot be empty',
        })
    }

    const searchUrl = new URL('https://api.rawg.io/api/games')
    searchUrl.searchParams.set('key', rawgApi)
    searchUrl.searchParams.set('search', gameName.trim())
    searchUrl.searchParams.set('page_size', '1')

    let response: Response
    try {
        response = await fetch(searchUrl.toString())
    } catch (error) {
        throw createError({
            statusCode: 502,
            message: `Failed to connect to RAWG API: ${error instanceof Error ? error.message : 'Unknown error'}`,
        })
    }

    if (!response.ok) {
        if (response.status === 401) {
            throw createError({
                statusCode: 502,
                message:
                    'Invalid RAWG API key. Please check your NUXT_RAWG_API environment variable.',
            })
        }
        throw createError({
            statusCode: 502,
            message: `RAWG API request failed with status ${response.status}: ${response.statusText}`,
        })
    }

    let data: RawgApiResponse
    try {
        data = await response.json()
    } catch {
        throw createError({
            statusCode: 502,
            message: 'Failed to parse RAWG API response as JSON',
        })
    }

    if (!data.results || data.results.length === 0) {
        throw createError({
            statusCode: 204,
            message: `No game found with name: "${gameName}"`,
        })
    }

    const [game] = data.results

    if (!game.name || !game.description || !game.released) {
        throw createError({
            statusCode: 500,
            message:
                'Game data is incomplete. Missing required fields (name, description, or releaseDate).',
        })
    }

    const gameMetadata: GameMetadata = {
        title: game.name,
        description: game.description,
        platform:
            game.platforms?.map((p) => p.platform.name).join(', ') || 'Unknown',
        releaseDate: game.released,
        developer: game.developers?.[0]?.name || 'Unknown',
        publisher: game.publishers?.[0]?.name || 'Unknown',
        genre: game.genres?.map((g) => g.name) || [],
    }

    try {
        return v.parse(GameMetadataSchema, gameMetadata)
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: `Failed to validate game metadata: ${error instanceof Error ? error.message : 'Unknown validation error'}`,
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
