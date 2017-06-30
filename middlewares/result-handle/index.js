'use strict';

const fs     = require('fs');
const http   = require('http');
const mkdirp = require('mkdirp');
const _      = require('lodash');

const codeToStatus = require('./defines').codeToStatus;

const JSONSTRING = 'JSONString';
const ECONDING   = 'utf8';

/**
 * resultHandle
 * @param {Object}      options
 * @param {Object}      [options.format='JSONString']      - 默认接口返回的数据格式 JSON|JSONString
 * @param {Object}      [options.econding='utf8']          - 默认接口返回的数据编码
 * @param {Object}      options.views                      - 默认模版，如views[500]='500.ejs'
 * @returns {Function}
 */
exports.resultHandle = function (options) {
  options           = options || {};
  let defaultFormat = options.format || JSONSTRING;

  let econding = options.econding || ECONDING;

  let views = options.views;

  // 定义应用级返回码
  if (options.statusCode) {
    for (let key in options.statusCode) {
      codeToStatus[options.statusCode[key].code] = options.statusCode[key];
    }
  }

  /**
   * finallyResp - 统一返回处理逻辑
   * @param {Object}            result            - 处理前的结果对象
   * @param {String}            result.status     - 状态
   * @param {*}                 result.msg        - 数据
   * @param {*}                 result.ext        - 扩展
   * @param {Error|String}      result.err        - 错误
   * @param {String}            result.desc       - 描述
   * @param {String}            result.view       - 视图模版(渲染成功)
   * @param {String}            result.errorView  - 视图模版(渲染出错)
   * @param {String}            result.page       - 静态文件路径
   *
   * @param {http.Request}      req               - http.Request
   * @param {String}            req.query.format  - 接口返回的数据格式
   *
   * @param {http.Response}     res               - http.Response
   *
   * @param {Function}          next              - app.next
   *
   * @description
   *
   * @returns {*}
   */

  return function finallyResp(result, req, res, next) {
    if (_.isError(result)) {
      logger.error(result);
      result = {
        status: 'error',
        code  : '500',
        err   : result,
        desc  : result.message,
        msg   : result.message,
      };
    }

    let final = codeToStatus[result.code];

    if (!final) {
      throw new Error('result.code undefined!');
    }

    let url = req.url;

    let msg = result.msg || final.desc;
    let ext = result.ext || {};

    let view = result.view || views[final.statusCode] || final.view;
    let page = result.page;

    let err  = result.err;
    let desc = result.desc || final.desc;

    //res.status(final.statusCode);

    function dealError(statusCode, err, view) {
      res.status(statusCode);
      let errorView = result.errorView || views[statusCode] || view;
      if (!errorView) {
        res.end(http.STATUS_CODES[statusCode]);
      } else {
        res.render(errorView, {msg: msg, err: err});
      }
    }

    function logAndDealError(url, statusCode, err, view) {
      logError(url, err);
      dealError(statusCode, err, view);
    }

    if (view) {
      if (err) {
        logAndDealError(url, 500, err, view);
      } else {
        res.render(view, msg, function (err, html) {
          if (err) {
            logAndDealError(url, 500, err, view);
          } else {
            if (page) {
              try {
                mkdirp.sync(path.dirname(page));
                fs.createWriteStream(page).write(html);
              } catch (err) {
                logError(url, err);
              }
            }
            res.send(html);
          }
        });
      }
    } else if (page) {
      try {
        res.sendFile(page);
      } catch (err) {
        logAndDealError(url, 404, err);
      }
    } else {
      if (err) {
        logError(url, err);
        if (_.isString(err)) {
          desc = err;
          msg  = err;
        }
      }
      let retObj = {
        succeed: final.succeed,
        code   : final.code,
        desc   : desc,
        msg    : msg,
        extData: ext
      };

      let format = result.format || req.query.format || defaultFormat;
      if (format === JSONSTRING) {
        res.send(JSON.stringify(retObj));
      } else {
        res.json(retObj);
      }
    }
  };
};

function logError(url, err) {
  if (err instanceof Error || _.isError(err)) {
    logger.error('\nError begin', '\n', err, '\n', url, '\n', 'Error end');
  } else if (_.isString(err)) {
    logger.warn('\nWarn begin', '\n', err, '\n', url, '\n', 'Warn end');
  }
}
