/// <reference path="../typings/index.d.ts"/>

import 'semantic-ui-css/components/reset.min.css';
import 'semantic-ui-css/components/site.min.css';
import 'semantic-ui-css/components/container.min.css';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/loader.min.css';
import 'semantic-ui-css/components/grid.min.css';
import 'semantic-ui-css/components/menu.min.css';
import 'semantic-ui-css/components/image.min.css';
import 'semantic-ui-css/components/icon.min.css';
import 'semantic-ui-css/components/input.min.css';
import 'semantic-ui-css/components/label.min.css';
import 'semantic-ui-css/components/checkbox.min.css';
import 'semantic-ui-css/components/form.min.css';
import 'semantic-ui-css/components/button.min.css';
import 'semantic-ui-css/components/segment.min.css';
import 'semantic-ui-css/semantic.js';
// import 'semantic-ui-css/semantic.css';

import 'core-js/client/shim';
import 'zone.js/dist/zone';

import '@angular/common';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
} else {
  // Error['stackTraceLimit'] = Infinity; // tslint:disable-line:no-string-literal
  require('zone.js/dist/long-stack-trace-zone'); // tslint:disable-line:no-var-requires
}

platformBrowserDynamic().bootstrapModule(AppModule);
