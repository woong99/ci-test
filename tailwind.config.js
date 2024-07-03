/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {
            colors: {
                'potato-1': '#B9A89B',
                'potato-2': '#B99E8F',
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
