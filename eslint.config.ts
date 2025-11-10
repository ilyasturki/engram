import ilyasso from '@ilyasso/eslint-config'
export default ilyasso({
    rules: {
        // useless rules when using auto import
        'vue/no-undef-properties': 'off',

        // Slow development down, re-add when the app will be more complex
        'no-await-in-loop': 'off',
        'no-magic-numbers': 'off',
    },
})
