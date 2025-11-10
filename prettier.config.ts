import type { Config } from 'prettier'

const config: Config = {
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
