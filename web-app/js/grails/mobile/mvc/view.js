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
 * View are directly linked to the display of data. It uses jQuery
 * for its rendering.
 */
define(["grails/mobile/event",
    "grails/mobile/mvc/model"],
    function (event, model) {
        var _event = event;
        var _model = model;
        return function (model, elements) {
            var that = {};
            that.model = model;
            that.elements = elements;

            // List of events for the view
            that.createButtonClicked = _event();
            that.updateButtonClicked = _event();
            that.addButtonClicked = _event();
            that.deleteButtonClicked = _event();
            that.listButtonClicked = _event();
            that.editButtonClicked = _event();

            that.onlineEvent = _event();
            that.offlineEvent = _event();


            // Detect online/offline from browser
            addEventListener('offline', function (e) {
                that.offlineEvent.notify();
            });

            addEventListener('online', function (e) {
                that.onlineEvent.notify();
            });

            return that;
        }
    });


