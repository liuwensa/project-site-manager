
'use strict';

/**
 * @param {type} params description
 */
module.exports = function (params) {
  if (typeof params === 'function') {
    return catchError(params);
  }
  if (typeof params === 'object') {
    for (let key in params) {
      if (typeof params[key] === 'function') {
        params[key] = catchError(params[key]);
      }
    }
  }
  return params;
};

/**
 * 处理错误
 * @param controller
 * @returns {Function}
 */
function catchError(controller) {
  return function (req, res, next) {
    let ret = controller.apply(this, arguments);
    if (ret && typeof ret.then === 'function') {
      return ret.catch((err) => {
        return next({code : 500, msg : err.message || err, err : err});
      });
    }
    logger.error(controller.name + ' doesn\'t return a promise');
    return ret;
  };
}
