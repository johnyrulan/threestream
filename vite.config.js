import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue';
import Mkcert from "vite-plugin-mkcert";

const path = require('path')

export default defineConfig({
    plugins: [vue(), Mkcert()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.mjs', '.js', '.ts', '.json', '.vue']    
    },
    server: {
        host: 'localhost',
        port: '7005',
        https: true
    }    
})