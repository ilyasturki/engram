import ilyasso from '@ilyasso/eslint-config'
export default ilyasso({
    rules: {
        'vue/no-undef-components': 'off', // some false positive like NuxtLayout or NuxtPage

        'unicorn/filename-case': [
            'error',
            {
                case: 'kebabCase',
                ignore: ['README.md', 'CLAUDE.md', 'AGENTS.md', 'GEMINI.md'],
            },
        ],

        // Slow development, add when the app will be more complex
        'no-await-in-loop': 'off',
    },
})
