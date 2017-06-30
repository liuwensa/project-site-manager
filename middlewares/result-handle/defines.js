
'use strict';

const base = [
  {statusCode: 200, succeed: true, code: 200, status: 'success', desc: '成功'},
  {statusCode: 500, succeed: false, code: 500, status: 'error', desc: ''},
  {statusCode: 401, succeed: false, code: 401, status: 'invalidToken', desc: 'invalid token'},
  {statusCode: 404, succeed: true, code: 404, status: 'notFound', desc: '接口不存在'}
];

const extend = [];

const statusToCode = {};
const codeToStatus = {};

base.concat(extend).forEach(function (item) {
  statusToCode[item.status] = codeToStatus[item.code] = item;
});

module.exports = {
  statusToCode: statusToCode,
  codeToStatus: codeToStatus
};
