/*
 * Copyright 2012 3musket33rs
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The Controller. Controller is notified by view of user actions.
 * Controller sends asynchronous call to server if needed and changes
 * the model.
 */

define(["require",
    "grails/grailsEvents",
    "grails/mobile/mvc/model",
    "grails/mobile/mvc/view",
    "grails/mobile/storage/store",
    "grails/mobile/feed/feed",
    "grails/mobile/mvc/controller",
    "grails/mobile/sync/syncmanager",
    "grails/mobile/push/pushmanager"],
    function (require, events, model, view,  store, feed, controller, syncManager, pushManager) {
        var _events = events;
        var _model = model;
        var _view = view;
        var _store = store;
        var _feed = feed;
        var _controller = controller;
        var _syncManager = syncManager;
        var _pushManager = pushManager;

        return function (conf) {
            var that = {};

            var baseURL = conf.baseURL;
            var namespace = conf.namespace;
            var grailsEvents = new _events(conf.baseURL, {transport:'sse'});

            var controllers = {};

            that.domainsObjects = {};
            $.each(conf.domain, function () {

                if (this.options === undefined) {
                    this.options = {
                        offline:true,
                        eventPush:true
                    }
                }

                var domainName = this.name;

                // create model for domain object
                var model = _model();

                // create local storage for domain object
                if (this.options.offline) {
                    var store = _store(model, domainName);
                }

                // create view for domain object
                var myView = require('../../../' + namespace + '/view/' + this.name + '-view');
                myView = myView(model, this.view);

                // Create Feed
                var feed = _feed(baseURL + this.name + '/', store);

                // create controller for domain object
                var controller = _controller(feed, model, myView);

                var sync = _syncManager(baseURL + this.name + '/', domainName, controller, store, model, this.options);

                var push = _pushManager(grailsEvents, domainName, store, model, this.options);

                that.domainsObjects[domainName] = {
                    model:model,
                    view:myView,
                    controller:controller,
                    sync:sync,
                    push:push
                };
            });

            $.each(conf.domain, function () {
                if (this.hasOneRelations) {
                    that.domainsObjects[this.name].controller.hasOneRelations = {};
                    for (var i = 0; i < this.hasOneRelations.length; i++) {
                        var relationName = this.hasOneRelations[i].type + '_' + this.hasOneRelations[i].name;
                        that.domainsObjects[this.name].controller.hasOneRelations[relationName] = that.domainsObjects[this.hasOneRelations[i].type].controller;
                    }
                }
                if (this.oneToManyRelations) {
                    that.domainsObjects[this.name].controller.oneToManyRelations = {};
                    for (var i = 0; i < this.oneToManyRelations.length; i++) {
                        var relationName = this.oneToManyRelations[i].type + '_' + this.oneToManyRelations[i].name;
                        that.domainsObjects[this.name].controller.oneToManyRelations[relationName] = that.domainsObjects[this.oneToManyRelations[i].type].controller;
                    }
                }
            });

            return that;
        }
    });