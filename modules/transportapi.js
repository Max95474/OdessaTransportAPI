'use strict';

const request = require('request-promise');
const qs = require('qs');

const BASE_URL = 'http://transport.odessa.ua/php';
const METHOD = {
  GET:    'get',
  POST:   'post',
  PUT:    'put',
  DELETE: 'delete'
};
const PATH = {
  routesList:   'LoadingListRoutes.php',
  route:        'LoadingRoute.php',
  stoppingList: 'LoadingListStopping.php',
  masterList:   'LoadingListMaster.php',
  state:        'getState.php'
};
const LANG = 'ru';

function getRoutes() {
  return exec(PATH.routesList, METHOD.GET)
}

function getRoute(type, routeId) {
  const data = {
    type: type,
    number: routeId,
    language: LANG
  };

  return request.post({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    uri: `${BASE_URL}/${PATH.route}`,
    body: qs.stringify(data)
  }).then(data => JSON.parse(data))
}

function getStoppings(stoppingIds) {
  const data = {
    stopping: stoppingIds,
    language: LANG
  };

  return request.post({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      // "Content-Type": "application/json; charset=UTF-8",
    },
    uri: `${BASE_URL}/${PATH.stoppingList}`,
    body: qs.stringify(data)
  }).then(data => JSON.parse(data))
}

function getState(transportKeys) {
  return request.get({
    uri: `${BASE_URL}/${PATH.state}?${qs.stringify({imei: transportKeys})}`
  }).then(data => JSON.parse(data))
}

function buildURL(path) {
  return `${BASE_URL}/${path}`;
}

function exec(path, method, data) {
  const options = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    }
  };

  switch (method) {
    case METHOD.GET:
    case METHOD.DELETE:
      options.uri = buildURL(path);
      if(data) {
        options.uri += '&' + qs.stringify(data);
      }
      break;
    case METHOD.PUT:
    case METHOD.POST:
      options.uri = buildURL(path);
      if(data) {
        options.body = JSON.stringify(data);
      }
      break;
  }

  return request[method](options).then(data => JSON.parse(data))
}

module.exports = {
  getRoutes,
  getRoute,
  getStoppings,
  getState
};