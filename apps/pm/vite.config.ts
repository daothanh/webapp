import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

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
    }),
    Components({
      resolvers: [AntDesignVueResolver()]
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: pathResolve('src') + '/'
      }
    ]
  }
})
