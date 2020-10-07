# carforyou-ad-data-fetcher

Prefetches data in a headless browser so we can server-side render ads. This bases on a highly specific agreement with TXMA and CAR FOR YOU.

## How it works
A customer can serve custom images in place of our default emotional/hero image on our homepage.

In order circumvent a performance penalty on LCP, the ads images are prefetched on CI and stored in an S3 Bucket. TXMA configured the ad to store an object with all image sizes and the target url in a `data-ad` attribute of the ad container which is injected. The App fetches the ad images from the bucket and server-side renders them. On the client-side, the ad is loaded again, which allows for visibility tracking and overwriting the link target with a trackeable url.

## Application setup
When initializing the adslot in the application, dispatch the following event in it's callback so cypress can wait for the ad to be loaded before accessing its data:
```
const event = new CustomEvent("adHpEmotionalLoaded")
window.document.dispatchEvent(event)
```

The loaded ad will add an `data-ad` attribute with the ad data on this DOM element.
Have a look at the [example](./example).

## Usage
```
npm run fetch:prod
CYPRESS_AUTH_USER=abc CYPRESS_AUTH_PASS=123 npm run fetch:preprod
ls cypress/data/ads/*.json
```

## Testing
```
npm run test
```

## Debugging

The console output, including the one from `totmdebug` is visible in the cypress logs when using chrome for cypress.

## Available S3 buckets

### development and stage-dev
https://carforyou-dev-homepage-ads.s3.eu-central-1.amazonaws.com/master-dev.json
Content is modified manually for testing purposes and not relying on txma to serve an actual ad.

### stage-preprod
https://carforyou-preprod-homepage-ads.s3.eu-central-1.amazonaws.com/master-stage-preprod.json
File content is written by circeci

### stage-prod
https://carforyou-homepage-ads.s3.eu-central-1.amazonaws.com/master-stage-prod.json
File content is written by circeci

## Manual emergency takedown

In case some ads we can not accept end up on our page follow the described procedure to take them down.

1. Delete master.json in the production S3-Bucket
2. Disable the Circle CI job for production so the JSON will not be re-written
