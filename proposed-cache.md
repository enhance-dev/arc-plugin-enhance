## Versioning the static assets for each deploy
If we "version" all the static assets for each deploy instead of fingerprinting individual files the transforming the references becomes much easier. This way the replacement lookup for outgoing responses is as simple as "_public"->"_public/v123". This should be fast and less error prone. 
- `href=/_public/img.jpg` -> transformed into `href=/_public/v123/img.jpg`

Downsides of this are that even assets that don't change have their cache busted. Users have to know about and use "_public". 

## Root relative static references
This does work. First checks for the static asset and falls through to the app routes if not found. Look up is efficient and 404 works best this way. Problem is there is no good way to catch these in outgoing responses and transform them to the fingerprinted version safely or efficiently. The best way to do this is have non fingerprinted requests return successfully but with a header that does not cache them. Or have these requests redirect to the fingerprinted result. 

-  `href=/img.jpg` -> either 302 or respond with max-age=0
-  `href=${static.helper('/img.jpg')}` -> turns into `href=/img-123.jpg` can be cached forever. 

## Simple Versioning
1. On deploy set a ENHANCE_CACHE_ID environment variable (i.e. ENHANCE_CACHE_ID=XYZ123). Could be GUID or epoch just unique.
2. Do a simple search and replace on every outgoing response changing `/_public/`->`/_public/v-XYZ123/`
3. Deploy static assets to as through architect with no fingerprinting
4. Any request to `/_public/v-XYZ123/foo.mjs` gets the 200 response and is cached forever
5. Any incorrect request to `/_public/v-NOT123/foo.mjs` or `/_public/foo.mjs` gets 302 redirect to `/_public/v-XYZ123/foo.mjs` 
6. When any static asset is returned do the same replacement for `/_public/`->`/_public/v-XYZ123/`. This solves the circular reference problem. It does not solve the waterfall issue so there are still extra requests, but this bundling can be handled by the opt in @bundles pragma (which can even point to a file inside public folder to fully bundle it into the /bundles folder). 

Benefits:
- Eliminates static.json
- Doesn't require changes to Architect (just turn fingerprinting off)
- Simple therefore less error prone (hopefully)
- Search and replace on outgoing requests is very simple and should be very fast
- Strong caching guarantees (`/_public/v-XYZ123/foo.mjs` is as unique as `/_public/foo-XYZ123.mjs` and can be safely cached forever)
- Does not require storing older versions of assets or different fingerprinted versions. Just update when changed.
- This is so simple that it adds minimal maintenance burden to support it forever even if we want to try to add the root relative assets in the future.
- "_public" or some other namespace keyword seems like essential complexity of static assets that we should not try to hide from people. If they are learning the platform they need to know that static assets are different than dynamic routes, and need different treatment.
- We should consider naming the actual folder "_public" to make it more intuitive less confusing and more obvious what is happening. 
- The name can be configured to be "public" or "whatever_they_want". 
