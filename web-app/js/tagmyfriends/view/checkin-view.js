define(["grails/mobile/mvc/view",
    "grails/mobile/helper/toObject"],
    function (parentView, helper) {
        var _parentView = parentView;
        var _helper = helper;
        return function (model, elements) {

            var that = _parentView(model, elements);

            // Register events
            that.model.listedItems.attach(function (data) {
                $('#list-checkin').empty();
                var key, items = model.getItems();
                $.each(items, function (key, value) {
                    renderElement(value);
                });
                $('#list-checkin').listview('refresh');
            });

            that.model.createdItem.attach(function (data, event) {
                if (data.item.errors) {
                    $.each(data.item.errors, function (index, error) {
                        $('#input-checkin-' + error.field).validationEngine('showPrompt', error.message, 'fail');
                    });
                    event.stopPropagation();
                } else if (data.item.message) {
                    showGeneralMessage(data, event);
                } else {
                    renderElement(data.item);
                    $('#list-checkin').listview('refresh');
                    if (!data.item.NOTIFIED) {
                        $.mobile.changePage($('#section-list-checkin'));
                    }
                }
            });

            that.model.updatedItem.attach(function (data, event) {
                if (data.item.errors) {
                    $.each(data.item.errors, function (index, error) {
                        $('#input-checkin-' + error.field).validationEngine('showPrompt', error.message, 'fail');
                    });
                    event.stopPropagation();
                } else if (data.item.message) {
                    showGeneralMessage(data, event);
                } else {
                    updateElement(data.item);
                    $('#list-checkin').listview('refresh');
                    if (!data.item.NOTIFIED) {
                        $.mobile.changePage($('#section-list-checkin'));
                    }
                }
            });

            that.model.deletedItem.attach(function (data, event) {
                if (data.item.message) {
                    showGeneralMessage(data, event);
                } else {
                    if (data.item.offlineStatus === 'NOT-SYNC') {
                        $('#checkin-list-' + data.item.id).parents('li').replaceWith(createListItem(data.item));
                    } else {
                        $('#checkin-list-' + data.item.id).parents('li').remove();
                    }
                    $('#list-checkin').listview('refresh');
                    if (!data.item.NOTIFIED) {
                        $.mobile.changePage($('#section-list-checkin'));
                    }
                }
            });
            that.model.listedDependentItems.attach(function (data) {
                if (data.relationType === 'many-to-one') {
                    renderDependentList(data.dependentName, data.items);
                }
                if (data.relationType === 'one-to-many') {
                    renderMultiChoiceDependentList(data.dependentName, data.items);
                }
            });

            // user interface actions
            that.elements.list.live('pageinit', function (e) {
                that.listButtonClicked.notify();
            });

            that.elements.save.live('click tap', function (event) {
                event.stopPropagation();
                $('#form-update-checkin').validationEngine('hide');
                if ($('#form-update-checkin').validationEngine('validate')) {
                    var obj = _helper().toObject($('#form-update-checkin').find('input, select'));
                    var newElement = {
                        checkin:JSON.stringify(obj)
                    };
                    if (obj.id === '') {
                        that.createButtonClicked.notify(newElement, event);
                    } else {
                        that.updateButtonClicked.notify(newElement, event);
                    }
                }
            });

            that.elements.remove.live('click tap', function (event) {
                event.stopPropagation();
                that.deleteButtonClicked.notify({ id:$('#input-checkin-id').val() }, event);
            });

            that.elements.add.live('click tap', function (event) {
                event.stopPropagation();
                $('#form-update-checkin').validationEngine('hide');
                $('#form-update-checkin').validationEngine({promptPosition:'bottomLeft'});
                that.editButtonClicked.notify();
                createElement();
            });

            that.elements.show.live('click tap', function (event) {
                event.stopPropagation();
                $('#form-update-checkin').validationEngine('hide');
                $('#form-update-checkin').validationEngine({promptPosition:'bottomLeft'});
                that.editButtonClicked.notify();
                showElement($(event.currentTarget).attr("data-id"));
            });

            var createElement = function () {
                resetForm('form-update-checkin');
                $.mobile.changePage($('#section-show-checkin'));
                $('#delete-checkin').css('display', 'none');
            };

            var showElement = function (id) {
                resetForm('form-update-checkin');
                var element = that.model.items[id];
                var value = element['place.id'];
                if (!value) {
                    value = element.place.id;
                }
                $('select[data-gorm-relation="many-to-one"][name="place"]').val(value).trigger("change");

                var friendsSelected = element.friends;
                $.each(friendsSelected, function (key, value) {
                    var selector = '#checkbox-friends-' + value.id
                    $(selector).attr('checked', 'checked').checkboxradio('refresh');
                });
                $.each(element, function (name, value) {
                    var input = $('#input-checkin-' + name);
                    input.val(value);
                    if (input.attr('data-type') == 'date') {
                        input.scroller('setDate', (value === '') ? '' : new Date(value), true);
                    }
                });
                $('#delete-checkin').show();
                $.mobile.changePage($('#section-show-checkin'));
            };

            var resetForm = function (form) {
                $('input[data-type="date"]').each(function () {
                    $(this).scroller('destroy').scroller({
                        preset:'date',
                        theme:'default',
                        display:'modal',
                        mode:'scroller',
                        dateOrder:'mmD ddyy'
                    });
                });
                var div = $("#" + form);
                div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
                div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');//.checkboxradio('refresh');
            };


            var refreshSelectDropDown = function (select, newOptions) {
                var options = null;
                if (select.prop) {
                    options = select.prop('options');
                } else {
                    options = select.attr('options');
                }
                $('option', select).remove();
                $.each(newOptions, function (val, text) {
                    options[options.length] = new Option(text, val);
                });
                select.val(options[0]);
            };

            var renderDependentList = function (dependentName, items) {
                var manyToOneSelectForDependent = $('select[data-gorm-relation="many-to-one"][name=' + dependentName + ']');
                var options = {};
                $.each(items, function () {
                    var key = this.id;
                    var value = getText(this);
                    options[key] = value;
                });
                refreshSelectDropDown(manyToOneSelectForDependent, options);
            };

            var refreshMultiChoices = function (oneToMany, dependentName, newOptions) {
                oneToMany.empty();
                $.each(newOptions, function (key, val) {
                    oneToMany.append('<input type="checkbox" data-gorm-relation="one-to-many" name="' + dependentName + '" id="checkbox-' + dependentName + '-' + key + '"/><label for="checkbox-' + dependentName + '-' + key + '">' + val + '</label>');
                });
                oneToMany.parent().trigger('create');
            };

            var renderMultiChoiceDependentList = function (dependentName, items) {
                var oneToMany = $('#multichoice-' + dependentName);
                var options = {};
                $.each(items, function () {
                    var key = this.id;
                    var value = getText(this);
                    options[key] = value;
                });
                refreshMultiChoices(oneToMany, dependentName, options);
            };

            var createListItem = function (element) {
                var li, a = $('<a>');
                a.attr({
                    id:'checkin-list-' + element.id,
                    'data-id':element.id,
                    'data-transition':'fade'
                });
                a.text(getText(element));
                if (element.offlineStatus === 'NOT-SYNC') {
                    li = $('<li>').attr({'data-theme':'e'});
                    li.append(a);
                } else {
                    li = $('<li>').append(a);
                }
                return li;
            };

            var renderElement = function (element) {
                $('#list-checkin').append(createListItem(element));
            };

            var updateElement = function (element) {
                $('#checkin-list-' + element.id).parents('li').replaceWith(createListItem(element));
            };

            var getText = function (data) {
                var textDisplay = '';
                $.each(data, function (name, value) {
                    if (name !== 'class' && name !== 'id' && name !== 'offlineAction' && name !== 'offlineStatus'
                        && name !== 'status' && name !== 'version' && name != 'longitude' && name != 'latitude'
                        && name != 'NOTIFIED') {
                        if (typeof value !== 'object') {   // do not display relation in list view
                            textDisplay += value + ' - ';
                        }
                    }
                });
                return textDisplay.substring(0, textDisplay.length - 2);
            };

            var showGeneralMessage = function (data, event) {
                $.mobile.showPageLoadingMsg($.mobile.pageLoadErrorMessageTheme, data.item.message, true);
                setTimeout($.mobile.hidePageLoadingMsg, 3000);
                event.stopPropagation();
            };

            return that;
        }
    });