


var tagmyfriends = tagmyfriends || {};
tagmyfriends.view = tagmyfriends.view || {};

tagmyfriends.view.checkinview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);
    
    // Register events
    that.model.listedDependentItems.attach(function (data) {
        renderDependentList();
    });
    that.model.listedItems.attach(function (data) {
        renderList();
    });

    that.model.createdItem.attach(function (data) {
        renderElement(data.item);
        $('#list-checkins').listview('refresh');
        mapServiceList.refreshCenterZoomMap();
    });

    that.model.updatedItem.attach(function (data) {
         renderList();
    });

    that.model.deletedItem.attach(function (data) {
        $('#checkin' + data.item.id + '-in-list').parents('li').remove();
        mapServiceList.removeMarker(data.item.id);
        mapServiceList.refreshCenterZoomMap();
    });

    // user interface actions
    
    that.elements.list.live('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.save.live("click tap", function () {
        var obj = grails.mobile.helper.toObject($("#form-update-checkin").find("input, select"));

        var newElement = {
            checkin: JSON.stringify(obj)
        };
        if (obj.id === "") {
            that.createButtonClicked.notify(newElement);
        } else {
            that.updateButtonClicked.notify(newElement);
        }
    });

    that.elements.remove.live("click tap", function () {
        that.deleteButtonClicked.notify({ id: $('#input-checkin-id').val() });
    });

    // Detect online/offline from browser
    addEventListener('offline', function(e) {
        that.offlineEvent.notify();
    });

    addEventListener('online', function(e) {
        that.onlineEvent.notify();
    });

    // Detect online/offline from application
    $("#offline").live("click tap", function () {
        that.offlineEvent.notify();
    });

    $("#online").live("click tap", function () {
        that.onlineEvent.notify();
    });

    that.elements.add.live('pageshow', function (e) {
        var url = $(e.target).attr("data-url");
        var matches = url.match(/\?id=(.*)/);

        that.editButtonClicked.notify();

        if (matches) {
            showElement(matches[1]);
        } else {
            createElement();
        }
    });

    var createElement = function () {
        resetForm("form-update-checkin");
        
        $("#delete-checkin").hide();
    };

    var showElement = function (id) {
        resetForm("form-update-checkin");
        var element = that.model.items[id];

        $('select[data-gorm-relation="many-to-one"][name="place"]').val(element.place.id);
        $('select[data-gorm-relation="many-to-one"][name="place"]').selectmenu('refresh');

        $.each(element, function (name, value) {
            $('#input-checkin-' + name).val(value);
        });
        
        $("#delete-checkin").show();
    };

    var resetForm = function (form) {
        var div = $("#" + form);
        div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
        div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected').checkboxradio('refresh');
    };
    

    var renderList = function () {
        
        $('#list-checkins').empty();
        var key, items = model.getItems();
        for (key in items) {
            renderElement(items[key]);
        }
        $('#list-checkins').listview('refresh');
        
    };



    var refreshSelectDropDown = function (select, newOptions) {
        var options = null;
        if(select.prop) {
            options = select.prop('options');
        }
        else {
            options = select.attr('options');
        }
        $('option', select).remove();

        $.each(newOptions, function(val, text) {
            options[options.length] = new Option(text, val);
        });
        select.val(options[0]);
        select.selectmenu('refresh');
    }

    var renderDependentList = function () {

        var manyToOneSelectForPlace = $('select[data-gorm-relation="many-to-one"][name="place"]');
        var options = {};
        var key, items = model.getDependentItems();
        $.each(items, function() {
            var key = this.id;
            var value = this.name;
            options[key] = value;
        });

        refreshSelectDropDown(manyToOneSelectForPlace, options)
    };

    var renderElement = function (element) {
        if (element.offlineAction !== 'DELETED') {
            var a = $('<a>').attr({ href: '#section-show-checkin?id=' + element.id });
            a.attr({id : 'checkin' + element.id + '-in-list'});
            a.attr({'data-transition': 'fade' });
            a.text(getText(element));
            if (element.offlineStatus === "NOT-SYNC") {
                $("#list-checkins").append($('<li data-theme="e">').append(a));
            } else {
                $("#list-checkins").append($('<li>').append(a));
            }
            
        }
    };

    var getText = function (data) {
        var textDisplay = '';
        $.each(data, function (name, value) {
            if (name !== 'class' && name !== 'id' && name !== 'offlineAction' && name !== 'offlineStatus' && name !== 'status' && name !== 'version') {
                textDisplay += value + ";";
            }
        });
        return textDisplay.substring(0, textDisplay.length - 1);
    };

    return that;
};