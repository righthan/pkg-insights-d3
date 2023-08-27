import { rest } from 'msw' 
import { setupServer } from 'msw/node'

export const server = setupServer(
    rest.get(`http://127.0.0.1:50000/depgraph/default/10`,(req, res, ctx) => {
        return res(ctx.json({
            "entryPackageName": "packagedepgraph",
            "entryVersion": "1.0.0",
            "nodeCount": 59,
            "nodes": [
                {
                    "name": "packagedepgraph&1.0.0",
                    "count": 0
                },
                {
                    "name": "express&4.18.2",
                    "count": 1
                },
                {
                    "name": "accepts&1.3.8",
                    "count": 1
                },
                {
                    "name": "array-flatten&1.1.1",
                    "count": 1
                },
                {
                    "name": "body-parser&1.20.1",
                    "count": 1
                },
                {
                    "name": "content-disposition&0.5.4",
                    "count": 1
                },
                {
                    "name": "content-type&1.0.5",
                    "count": 2
                },
                {
                    "name": "cookie&0.5.0",
                    "count": 1
                },
                {
                    "name": "cookie-signature&1.0.6",
                    "count": 1
                },
                {
                    "name": "debug&2.6.9",
                    "count": 4
                },
                {
                    "name": "depd&2.0.0",
                    "count": 4
                },
                {
                    "name": "encodeurl&1.0.2",
                    "count": 4
                },
                {
                    "name": "escape-html&1.0.3",
                    "count": 4
                },
                {
                    "name": "etag&1.8.1",
                    "count": 2
                },
                {
                    "name": "finalhandler&1.2.0",
                    "count": 1
                },
                {
                    "name": "fresh&0.5.2",
                    "count": 2
                },
                {
                    "name": "http-errors&2.0.0",
                    "count": 4
                },
                {
                    "name": "merge-descriptors&1.0.1",
                    "count": 1
                },
                {
                    "name": "methods&1.1.2",
                    "count": 1
                },
                {
                    "name": "on-finished&2.4.1",
                    "count": 4
                },
                {
                    "name": "parseurl&1.3.3",
                    "count": 3
                },
                {
                    "name": "path-to-regexp&0.1.7",
                    "count": 1
                },
                {
                    "name": "proxy-addr&2.0.7",
                    "count": 1
                },
                {
                    "name": "qs&6.11.0",
                    "count": 2
                },
                {
                    "name": "range-parser&1.2.1",
                    "count": 2
                },
                {
                    "name": "safe-buffer&5.2.1",
                    "count": 2
                },
                {
                    "name": "send&0.18.0",
                    "count": 2
                },
                {
                    "name": "serve-static&1.15.0",
                    "count": 1
                },
                {
                    "name": "setprototypeof&1.2.0",
                    "count": 2
                },
                {
                    "name": "statuses&2.0.1",
                    "count": 4
                },
                {
                    "name": "type-is&1.6.18",
                    "count": 2
                },
                {
                    "name": "utils-merge&1.0.1",
                    "count": 1
                },
                {
                    "name": "vary&1.1.2",
                    "count": 1
                },
                {
                    "name": "mime-types&2.1.35",
                    "count": 2
                },
                {
                    "name": "negotiator&0.6.3",
                    "count": 1
                },
                {
                    "name": "bytes&3.1.2",
                    "count": 2
                },
                {
                    "name": "destroy&1.2.0",
                    "count": 2
                },
                {
                    "name": "iconv-lite&0.4.24",
                    "count": 2
                },
                {
                    "name": "raw-body&2.5.1",
                    "count": 1
                },
                {
                    "name": "unpipe&1.0.0",
                    "count": 3
                },
                {
                    "name": "ms&2.0.0",
                    "count": 1
                },
                {
                    "name": "inherits&2.0.4",
                    "count": 1
                },
                {
                    "name": "toidentifier&1.0.1",
                    "count": 1
                },
                {
                    "name": "ee-first&1.1.1",
                    "count": 1
                },
                {
                    "name": "forwarded&0.2.0",
                    "count": 1
                },
                {
                    "name": "ipaddr.js&1.9.1",
                    "count": 1
                },
                {
                    "name": "side-channel&1.0.4",
                    "count": 1
                },
                {
                    "name": "mime&1.6.0",
                    "count": 1
                },
                {
                    "name": "ms&2.1.3",
                    "count": 1
                },
                {
                    "name": "media-typer&0.3.0",
                    "count": 1
                },
                {
                    "name": "mime-db&1.52.0",
                    "count": 1
                },
                {
                    "name": "safer-buffer&2.1.2",
                    "count": 1
                },
                {
                    "name": "call-bind&1.0.2",
                    "count": 1
                },
                {
                    "name": "get-intrinsic&1.2.1",
                    "count": 2
                },
                {
                    "name": "object-inspect&1.12.3",
                    "count": 1
                },
                {
                    "name": "function-bind&1.1.1",
                    "count": 3
                },
                {
                    "name": "has&1.0.3",
                    "count": 1
                },
                {
                    "name": "has-proto&1.0.1",
                    "count": 1
                },
                {
                    "name": "has-symbols&1.0.3",
                    "count": 1
                }
            ],
            "links": [
                {
                    "source": "packagedepgraph&1.0.0",
                    "target": "express&4.18.2"
                },
                {
                    "source": "express&4.18.2",
                    "target": "accepts&1.3.8"
                },
                {
                    "source": "express&4.18.2",
                    "target": "array-flatten&1.1.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "body-parser&1.20.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "content-disposition&0.5.4"
                },
                {
                    "source": "express&4.18.2",
                    "target": "content-type&1.0.5"
                },
                {
                    "source": "express&4.18.2",
                    "target": "cookie&0.5.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "cookie-signature&1.0.6"
                },
                {
                    "source": "express&4.18.2",
                    "target": "debug&2.6.9"
                },
                {
                    "source": "express&4.18.2",
                    "target": "depd&2.0.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "encodeurl&1.0.2"
                },
                {
                    "source": "express&4.18.2",
                    "target": "escape-html&1.0.3"
                },
                {
                    "source": "express&4.18.2",
                    "target": "etag&1.8.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "finalhandler&1.2.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "fresh&0.5.2"
                },
                {
                    "source": "express&4.18.2",
                    "target": "http-errors&2.0.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "merge-descriptors&1.0.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "methods&1.1.2"
                },
                {
                    "source": "express&4.18.2",
                    "target": "on-finished&2.4.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "parseurl&1.3.3"
                },
                {
                    "source": "express&4.18.2",
                    "target": "path-to-regexp&0.1.7"
                },
                {
                    "source": "express&4.18.2",
                    "target": "proxy-addr&2.0.7"
                },
                {
                    "source": "express&4.18.2",
                    "target": "qs&6.11.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "range-parser&1.2.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "safe-buffer&5.2.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "send&0.18.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "serve-static&1.15.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "setprototypeof&1.2.0"
                },
                {
                    "source": "express&4.18.2",
                    "target": "statuses&2.0.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "type-is&1.6.18"
                },
                {
                    "source": "express&4.18.2",
                    "target": "utils-merge&1.0.1"
                },
                {
                    "source": "express&4.18.2",
                    "target": "vary&1.1.2"
                },
                {
                    "source": "accepts&1.3.8",
                    "target": "mime-types&2.1.35"
                },
                {
                    "source": "accepts&1.3.8",
                    "target": "negotiator&0.6.3"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "bytes&3.1.2"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "content-type&1.0.5"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "debug&2.6.9"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "depd&2.0.0"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "destroy&1.2.0"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "http-errors&2.0.0"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "iconv-lite&0.4.24"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "on-finished&2.4.1"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "qs&6.11.0"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "raw-body&2.5.1"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "type-is&1.6.18"
                },
                {
                    "source": "body-parser&1.20.1",
                    "target": "unpipe&1.0.0"
                },
                {
                    "source": "content-disposition&0.5.4",
                    "target": "safe-buffer&5.2.1"
                },
                {
                    "source": "debug&2.6.9",
                    "target": "ms&2.0.0"
                },
                {
                    "source": "finalhandler&1.2.0",
                    "target": "debug&2.6.9"
                },
                {
                    "source": "finalhandler&1.2.0",
                    "target": "encodeurl&1.0.2"
                },
                {
                    "source": "finalhandler&1.2.0",
                    "target": "escape-html&1.0.3"
                },
                {
                    "source": "finalhandler&1.2.0",
                    "target": "on-finished&2.4.1"
                },
                {
                    "source": "finalhandler&1.2.0",
                    "target": "parseurl&1.3.3"
                },
                {
                    "source": "finalhandler&1.2.0",
                    "target": "statuses&2.0.1"
                },
                {
                    "source": "finalhandler&1.2.0",
                    "target": "unpipe&1.0.0"
                },
                {
                    "source": "http-errors&2.0.0",
                    "target": "depd&2.0.0"
                },
                {
                    "source": "http-errors&2.0.0",
                    "target": "inherits&2.0.4"
                },
                {
                    "source": "http-errors&2.0.0",
                    "target": "setprototypeof&1.2.0"
                },
                {
                    "source": "http-errors&2.0.0",
                    "target": "statuses&2.0.1"
                },
                {
                    "source": "http-errors&2.0.0",
                    "target": "toidentifier&1.0.1"
                },
                {
                    "source": "on-finished&2.4.1",
                    "target": "ee-first&1.1.1"
                },
                {
                    "source": "proxy-addr&2.0.7",
                    "target": "forwarded&0.2.0"
                },
                {
                    "source": "proxy-addr&2.0.7",
                    "target": "ipaddr.js&1.9.1"
                },
                {
                    "source": "qs&6.11.0",
                    "target": "side-channel&1.0.4"
                },
                {
                    "source": "send&0.18.0",
                    "target": "debug&2.6.9"
                },
                {
                    "source": "send&0.18.0",
                    "target": "depd&2.0.0"
                },
                {
                    "source": "send&0.18.0",
                    "target": "destroy&1.2.0"
                },
                {
                    "source": "send&0.18.0",
                    "target": "encodeurl&1.0.2"
                },
                {
                    "source": "send&0.18.0",
                    "target": "escape-html&1.0.3"
                },
                {
                    "source": "send&0.18.0",
                    "target": "etag&1.8.1"
                },
                {
                    "source": "send&0.18.0",
                    "target": "fresh&0.5.2"
                },
                {
                    "source": "send&0.18.0",
                    "target": "http-errors&2.0.0"
                },
                {
                    "source": "send&0.18.0",
                    "target": "mime&1.6.0"
                },
                {
                    "source": "send&0.18.0",
                    "target": "ms&2.1.3"
                },
                {
                    "source": "send&0.18.0",
                    "target": "on-finished&2.4.1"
                },
                {
                    "source": "send&0.18.0",
                    "target": "range-parser&1.2.1"
                },
                {
                    "source": "send&0.18.0",
                    "target": "statuses&2.0.1"
                },
                {
                    "source": "serve-static&1.15.0",
                    "target": "encodeurl&1.0.2"
                },
                {
                    "source": "serve-static&1.15.0",
                    "target": "escape-html&1.0.3"
                },
                {
                    "source": "serve-static&1.15.0",
                    "target": "parseurl&1.3.3"
                },
                {
                    "source": "serve-static&1.15.0",
                    "target": "send&0.18.0"
                },
                {
                    "source": "type-is&1.6.18",
                    "target": "media-typer&0.3.0"
                },
                {
                    "source": "type-is&1.6.18",
                    "target": "mime-types&2.1.35"
                },
                {
                    "source": "mime-types&2.1.35",
                    "target": "mime-db&1.52.0"
                },
                {
                    "source": "iconv-lite&0.4.24",
                    "target": "safer-buffer&2.1.2"
                },
                {
                    "source": "raw-body&2.5.1",
                    "target": "bytes&3.1.2"
                },
                {
                    "source": "raw-body&2.5.1",
                    "target": "http-errors&2.0.0"
                },
                {
                    "source": "raw-body&2.5.1",
                    "target": "iconv-lite&0.4.24"
                },
                {
                    "source": "raw-body&2.5.1",
                    "target": "unpipe&1.0.0"
                },
                {
                    "source": "side-channel&1.0.4",
                    "target": "call-bind&1.0.2"
                },
                {
                    "source": "side-channel&1.0.4",
                    "target": "get-intrinsic&1.2.1"
                },
                {
                    "source": "side-channel&1.0.4",
                    "target": "object-inspect&1.12.3"
                },
                {
                    "source": "call-bind&1.0.2",
                    "target": "function-bind&1.1.1"
                },
                {
                    "source": "call-bind&1.0.2",
                    "target": "get-intrinsic&1.2.1"
                },
                {
                    "source": "get-intrinsic&1.2.1",
                    "target": "function-bind&1.1.1"
                },
                {
                    "source": "get-intrinsic&1.2.1",
                    "target": "has&1.0.3"
                },
                {
                    "source": "get-intrinsic&1.2.1",
                    "target": "has-proto&1.0.1"
                },
                {
                    "source": "get-intrinsic&1.2.1",
                    "target": "has-symbols&1.0.3"
                },
                {
                    "source": "has&1.0.3",
                    "target": "function-bind&1.1.1"
                }
            ],
            "depth": 8,
            "isCircle": false,
            "circleDepList": [],
            "isMulPackage": true,
            "mulPackageList": [
                {}
            ]
        }))
    }),
    rest.get(`http://127.0.0.1:50000/depgraph-simple/express%264.18.2`,(req, res, ctx) => {
        return res(ctx.json({
            "entryPackageName": "express",
            "entryVersion": "4.18.2",
            "nodeCount": 58,
            "depth": 7,
            "isCircle": false,
            "circleDepList": [],
            "isMulPackage": true,
            "mulPackageList": [
                {}
            ]
        }))
    })
)
