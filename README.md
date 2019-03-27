### Population data is taken from publicly accessible Google Sheets. This is a stand-alone site but targeted to be an application for TLV ODS portal.

## How to build
1. Run <code>yarn prepare</code> to merge geoJsons for city districts into one file (server as .json)
2. Run <code>yarn start</code> to serve from web-pack-devServer or <code>yarn build</code> just to build a bundle that may be served by any http server.
