define(["grails/mobile/mvc/view",
    "grails/mobile/helper/toObject"],
    function (parentView, helper) {
        var _parentView = parentView;
        var _helper = helper;
        return function (model, elements) {

            var that = _parentView(model, elements);

            // Register events
            that.model.listedItems.attach(function (data) {
                $('#list-friend').empty();
                var key, items = model.getItems();
                $.each(items, function (key, value) {
                    renderElement(value);
                });
                $('#list-friend').listview('refresh');
            });

            that.model.createdItem.attach(function (data, event) {
                if (data.item.errors) {
                    $.each(data.item.errors, function (index, error) {
                        $('#input-friend-' + error.field).validationEngine('showPrompt', error.message, 'fail');
                    });
                    event.stopPropagation();
                } else if (data.item.message) {
                    showGeneralMessage(data, event);
                } else {
                    renderElement(data.item);
                    $('#list-friend').listview('refresh');
                    if (!data.item.NOTIFIED) {
                        $.mobile.changePage($('#section-list-friend'));
                    }
                }
            });

            that.model.updatedItem.attach(function (data, event) {
                if (data.item.errors) {
                    $.each(data.item.errors, function (index, error) {
                        $('#input-friend-' + error.field).validationEngine('showPrompt', error.message, 'fail');
                    });
                    event.stopPropagation();
                } else if (data.item.message) {
                    showGeneralMessage(data, event);
                } else {
                    updateElement(data.item);
                    $('#list-friend').listview('refresh');
                    if (!data.item.NOTIFIED) {
                        $.mobile.changePage($('#section-list-friend'));
                    }
                }
            });

            that.model.deletedItem.attach(function (data, event) {
                if (data.item.message) {
                    showGeneralMessage(data, event);
                } else {
                    if (data.item.offlineStatus === 'NOT-SYNC') {
                        $('#friend-list-' + data.item.id).parents('li').replaceWith(createListItem(data.item));
                    } else {
                        $('#friend-list-' + data.item.id).parents('li').remove();
                    }
                    $('#list-friend').listview('refresh');
                    if (!data.item.NOTIFIED) {
                        $.mobile.changePage($('#section-list-friend'));
                    }
                }
            });

            // user interface actions
            that.elements.save.live('click tap', function (event) {
                event.stopPropagation();
                $('#form-update-friend').validationEngine('hide');
                if ($('#form-update-friend').validationEngine('validate')) {
                    var obj = _helper().toObject($('#form-update-friend').find('input, select'));
                    var newElement = {
                        friend:JSON.stringify(obj)
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
                that.deleteButtonClicked.notify({ id:$('#input-friend-id').val() }, event);
            });

            that.elements.add.live('click tap', function (event) {
                event.stopPropagation();
                $('#form-update-friend').validationEngine('hide');
                $('#form-update-friend').validationEngine({promptPosition:'bottomLeft'});
                createElement();
            });

            that.elements.show.live('click tap', function (event) {
                event.stopPropagation();
                $('#form-update-friend').validationEngine('hide');
                $('#form-update-friend').validationEngine({promptPosition:'bottomLeft'});
                showElement($(event.currentTarget).attr("data-id"));
            });

            var createElement = function () {
                resetForm('form-update-friend');
                $.mobile.changePage($('#section-show-friend'));
                $('#delete-friend').css('display', 'none');
            };

            var showElement = function (id) {
                resetForm('form-update-friend');
                var element = that.model.items[id];
                $.each(element, function (name, value) {
                    var input = $('#input-friend-' + name);
                    input.val(value);
                    if (input.attr('data-type') == 'date') {
                        input.scroller('setDate', (value === '') ? '' : new Date(value), true);
                    }
                });
                $('#delete-friend').show();
                $.mobile.changePage($('#section-show-friend'));
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

            var createListItem = function (element) {
                var li, a = $('<a>');
                a.attr({
                    id:'friend-list-' + element.id,
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
                $('#list-friend').append(createListItem(element));
            };

            var updateElement = function (element) {
                $('#friend-list-' + element.id).parents('li').replaceWith(createListItem(element));
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