/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    experimentalTernaries: true,
    experimentalOperatorPosition: 'start',
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    jsxSingleQuote: true,
    singleAttributePerLine: true,

    plugins: ['prettier-plugin-tailwindcss'],

    // tailwindcss plugin options
    tailwindStylesheet: './app/assets/css/main.css',
    tailwindFunctions: ['tw', 'cn', 'tv'],
}

export default config
