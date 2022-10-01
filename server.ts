import fs from 'fs'
import path from 'path'
import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: {
      middlewareMode: true
    },
    appType: 'custom'
  })

  app
    .use(vite.middlewares)
    .use(/.*/, async (req, res, next) => {
      const url = req.originalUrl

      try {
        let template = fs.readFileSync(
          path.resolve(__dirname, 'index.html'),
          'utf-8'
        )

        template = await vite.transformIndexHtml(url, template)

        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')

        const appHtml = await render(url)

        const html = template.replace('<!--ssr-outlet-->', appHtml)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (e: any) {
        vite.ssrFixStacktrace(e)
        next(e)
      }
    })
    .listen(3193)
}

createServer()