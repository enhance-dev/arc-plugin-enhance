import arc from '@architect/functions'
import api from './api.mjs'
import htm from './html.mjs'
import app from './app.mjs'

export const handler = arc.http.async(api, htm, app)
