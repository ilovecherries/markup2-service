import express from 'express'
import bodyParser from 'body-parser'

import Markup_Parse_12y2 from 'markup2/parse.js'
import Markup_Legacy from 'markup2/legacy.js'
import Markup_Langs from 'markup2/langs.js'

const langs = new Markup_Langs([new Markup_Parse_12y2(), new Markup_Legacy()])

const app = new express()
const port = 3000

app.use(bodyParser.text())

const langOptions = [ "12y", "12y2", "plaintext", "bbcode"]

app.post('/v1/markup', ({ body, query: { lang="12y" } }, res) => {
   if (!langOptions.includes(lang)) {
      res.status(400)
      res.send(JSON.stringify({
         type: 'invalid_lang',
         msg: `Invalid "lang" parameter. Must be one of [${langOptions.join(', ')}].`
      })+'\n')
      return
   }
   console.log(body)
   if (!(typeof body === 'string' || body instanceof String)) {
      res.status(400)
      res.send(JSON.stringify({
         type: 'empty_body',
         msg: 'Must send content in the body.'
      })+'\n')
      return
   }
   res.send(JSON.stringify(langs.parse(body || "", lang, {})) + "\n")
})

app.listen(port, () => {
   console.log(`Markup2 service running on port ${port}.`)
})