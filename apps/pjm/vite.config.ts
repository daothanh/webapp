import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr)
}

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 1099
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ant-')
        }
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: `${pathResolve('src')  }/`
      },
      {
        find: '#',
        replacement: `${pathResolve('src/types')  }/`
      }
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  }
})
