'use strict';

const fs = require('fs');
const path = require('path');
const routesAPI = require('../../modules/transportapi');

module.exports = {
  getRouteList,
  getRoute,
  getStoppingList,
  getMasterList,
  getState
};

let routesList, routes;

function init() {
  //Routes list
  const filePath = path.join(__dirname, '..', '..', 'data', 'routeList1490204063466.json');
  const data = fs.readFileSync(filePath);
  routesList = JSON.parse(data).list;

  //All routes
  const routesPath = path.join(__dirname, '..', '..', 'data');
  fs.readdir(routesPath, (err, files) => {
    const routesFilenames = files.filter(fileName => !!fileName.match(/route\d*.json/));
    Promise.all(routesFilenames.map(fileName => openFile(path.join(routesPath, fileName))))
      .then(result => routes = result.map(route => JSON.parse(route).data));
  })
}

function openFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, file) => {
      if(err) return reject(err);
      resolve(file)
    })
  })
}

function getRouteList(req, res) {
  // res.json(routesList);
  routesAPI.getRoutes()
    .then(data => res.status(200).json(data.list))
    .catch(err => res.status(500).json(err))
}

function getRoute(req, res) {
  const routeId = req.swagger.params.id.value;
  const route = routes.find(route => route.id == routeId);
  if(route) return res.status(200).json(route);
  res.sendStatus(404);
}

function getStoppingList(req, res) {

}

function getMasterList(req, res) {

}

function getState(req, res) {
  routesAPI.getState(req.query.imei)
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(err))
}

init();