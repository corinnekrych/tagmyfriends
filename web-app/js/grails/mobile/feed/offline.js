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
 */
define(["grails/mobile/helper/toObject"],
    function (helper) {
        var _helper = helper;
        return function (store) {
            var that = {};
            var store = store;
            var helperInstance = _helper();

            that.listItems = function (listed) {
                var list = store.read();
                listed(list);
            };

            that.createItem = function (data, created) {
                for (var k in data) {
                    data = data[k]; // remove formatting done in view needed by controller {domain: {id: "", ...}}
                }
                if (helperInstance.isString(data)) {
                    data = helperInstance.toDomainObject(data);
                }

                data.offlineStatus = "NOT-SYNC";
                data.offlineAction = "CREATED";
                data.id = generateId();
                store.store(data);
                created(data);
            };

            that.updateItem = function (data, updated) {
                for (var k in data) {
                    data = data[k]; // remove formatting done in view needed by controller {domain: {id: "", ...}}
                }
                if (helperInstance.isString(data)) {
                    data = helperInstance.toDomainObject(data);
                }
                data.offlineStatus = "NOT-SYNC";
                if (data.id && helperInstance.isString(data.id) && data.id.match("^" + "grails-") == "grails-") {
                    data.offlineAction = "CREATED";
                } else {
                    data.offlineAction = "UPDATED";
                }
                store.store(data);
                updated(data);
            };

            that.deleteItem = function (data, deleted) {
                data = store.read(data.id);

                if (data.id && helperInstance.isString(data.id) && data.id.match("^" + "grails-") == "grails-") {
                    data.offlineStatus = "";
                    store.remove(data);
                } else {
                    data.offlineStatus = "NOT-SYNC";
                    data.offlineAction = "DELETED";
                    store.store(data);
                }

                deleted(data);
            };

            var generateId = function () {
                var uuid = "", i, random;
                for (i = 0; i < 32; i++) {
                    random = Math.random() * 16 | 0;

                    if (i === 8 || i === 12 || i === 16 || i === 20) {
                        uuid += "-";
                    }
                    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
                }
                return "grails-" + uuid;
            };

            return that;
        }
    });

