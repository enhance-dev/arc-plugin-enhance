## Versioning the static assets for each deploy
If we "version" all the static assets for each deploy instead of fingerprinting individual files the transforming the references becomes much easier. This way the replacement lookup for outgoing responses is as simple as "_public"->"_public/v123". This should be fast and less error prone. 
- `href=/_public/img.jpg` -> transformed into `href=/_public/v123/img.jpg`

Downsides of this are that even assets that don't change have their cache busted. Users have to know about and use "_public". 

## Root relative static references
This does work. First checks for the static asset and falls through to the app routes if not found. Look up is efficient and 404 works best this way. Problem is there is no good way to catch these in outgoing responses and transform them to the fingerprinted version safely or efficiently. The best way to do this is have non fingerprinted requests return successfully but with a header that does not cache them. Or have these requests redirect to the fingerprinted result. 

-  `href=/img.jpg` -> either 302 or respond with max-age=0
-  `href=${static.helper('/img.jpg')}` -> turns into `href=/img-123.jpg` can be cached forever. 

