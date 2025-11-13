import * as v from 'valibot'

export function useValidatedRouteParams<T>(
    schema: v.GenericSchema<unknown, T>,
): T {
    const { params } = useRoute()
    const result = v.safeParse(schema, params)

    if (result.success) {
        return result.output
    }

    console.error('Params validation failed', result.issues)
    throw createError({
        statusCode: 500,
        statusMessage: 'Params validation failed',
        fatal: true,
    })
}
