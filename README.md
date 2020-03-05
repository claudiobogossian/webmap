# terrabrasilis
[![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![standard][standard-image]][standard-url] [![Code Climate][codeclimate-image]][codeclimate-url]

## Configuring the environment variables

```bash
export NODE_ENV="development"
export INPE_PROXY="http://terrabrasilis2.dpi.inpe.br:7000/cgi-bin/proxy.cgi?url="
export FIPCERRADO_OPERACAO="http://fipcerrado.dpi.inpe.br:8080/fipcerrado-geoserver/terraamazon/wms"
export PROXY_OGC="http://terrabrasilis.dpi.inpe.br/proxy?url="; 
export DASHBOARD_API_HOST="http://terrabrasilis.dpi.inpe.br/dashboard/api/v1/redis-cli/"
export TERRABRASILIS_API_HOST="http://terrabrasilis.dpi.inpe.br/terrabrasilis/api/v1/"
export TERRABRASILIS_BUSINESS_API_HOST="http://terrabrasilis.dpi.inpe.br/business/api/v1/"
```

## About

TerraBrasilis web portal is a platform developed by INPE to provide access, query, analysis and dissemination of spatial data generated by government environment monitoring programs such as PRODES and DETER.

## Development server

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.1.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

[travis-image]: https://img.shields.io/travis/terrabrasilis/webmap/master.svg?style=for-the-badge
[travis-url]: https://travis-ci.com/terrabrasilis/webmap
[daviddm-image]: https://img.shields.io/david/terrabrasilis/webmap.svg?style=for-the-badge
[daviddm-url]: https://david-dm.org/terrabrasilis/webmap
[coveralls-image]: http://img.shields.io/coveralls/terrabrasilis/webmap/master.svg?style=for-the-badge
[coveralls-url]: https://coveralls.io/github/terrabrasilis/webmap?branch=master
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=for-the-badge
[standard-url]: http://npm.im/standard
[codeclimate-image]: https://codeclimate.com/github/terrabrasilis/webmap/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/terrabrasilis/webmap