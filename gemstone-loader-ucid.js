/*
**  GemstoneJS -- Gemstone JavaScript Technology Stack
**  Copyright (c) 2016-2019 Gemstone Project <http://gemstonejs.com>
**  Licensed under Apache License 2.0 <https://spdx.org/licenses/Apache-2.0>
*/

/*  load internal requirements  */
const path        = require("path")
const crypto      = require("crypto")

/*  load external requirements  */
const loaderUtils = require("loader-utils")
const base58      = require("base-58")

/*  the exported Webpack loader function  */
module.exports = function (content) {
    /*  determine Webpack loader query parameters  */
    const options = Object.assign({}, {
        sourceDir:  ".",
        idMatch:    "__ucid",
        idReplace:  "ucid<ucid>"
    }, loaderUtils.getOptions(this), this.resourceQuery ? loaderUtils.parseQuery(this.resourceQuery) : null)

    /*  indicate to Webpack that our results are
        fully deterministic and can be cached  */
    this.cacheable(true)

    /*  determine filesystem path of content,
        relative to source directory and without any extensions  */
    let relPath = path.relative(path.resolve(options.sourceDir), path.resolve(this.resourcePath))
    relPath = relPath.replace(/([^\\/.]+)(?:\.[^\\/.]+)+$/, "$1")

    /*  determine syntactically harmless id from filesystem path  */
    const hash = crypto.createHash("md5")
    hash.update(relPath)
    const ucid = base58.encode(hash.digest())

    /*  inject */
    const match   = new RegExp(options.idMatch, "g")
    const replace = options.idReplace.replace(/<ucid>/, ucid)
    content = content.replace(match, replace)

    /*  return the resulting content  */
    return content
}

