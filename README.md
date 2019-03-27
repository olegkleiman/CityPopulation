### Tel-Aviv Population on MapBox for City districts between 2009-2016. Population data is taken from publically accessible Google Sheets.  This is a stand-alone site but targeted to be an application for TLV ODS portal.

## How to build
1. Run yarn prepare to merge geoJsons for city districts into one file (server as .json)
2. Run yarn start to serve from web-pack-devServer or yarn build just to build a bundle that may be served by any http server.
