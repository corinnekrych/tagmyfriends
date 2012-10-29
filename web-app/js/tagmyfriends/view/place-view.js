


var tagmyfriends = tagmyfriends || {};
tagmyfriends.view = tagmyfriends.view || {};

tagmyfriends.view.placeview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);
    
    var mapServiceList = grails.mobile.map.googleMapService();
    var mapServiceForm = grails.mobile.map.googleMapService();
    
    // Register events
    that.model.listedItems.attach(function (data) {
        renderList();
    });

    that.model.createdItem.attach(function (data) {
        renderElement(data.item);
        $('#list-places').listview('refresh');
    });

    that.model.updatedItem.attach(function (data) {
        var textDisplay = getText(data.item);
        $('#place' + data.item.id + '-in-list').text(textDisplay);
    });

    that.model.deletedItem.attach(function (data) {
        $('#place' + data.item.id + '-in-list').parents('li').remove();
    });

    // user interface actions
    
    $('#list-all-places').live('click tap', function (e, ui) {
        hideMapDisplay();
        showListDisplay();
    });

    $('#map-all-places').live('click tap', function (e, ui) {
        hideListDisplay();
        showMapDisplay();
    });
    
    that.elements.list.live('pageinit', function (e) {
        that.listButtonClicked.notify();
    });

    that.elements.save.live("click tap", function () {
        var obj = grails.mobile.helper.toObject($("#form-update-place").find("input, select"));
        var newElement = {
            place: JSON.stringify(obj)
        };
        if (obj.id === "") {
            that.createButtonClicked.notify(newElement);
        } else {
            that.updateButtonClicked.notify(newElement);
        }
    });

    that.elements.remove.live("click tap", function () {
        that.deleteButtonClicked.notify({ id: $('#input-place-id').val() });
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

        if (matches) {
            showElement(matches[1]);
        } else {
            createElement();
        }
    });

    var createElement = function () {
        resetForm("form-update-place");
        
        navigator.geolocation.getCurrentPosition(function (position) {
            $("#input-place-latitude").val(position.coords.latitude);
            $("#input-place-longitude").val(position.coords.longitude);
            mapServiceForm.showMap("map-canvas-form", position.coords.latitude, position.coords.longitude, true);
        });
        
        $("#delete-place").hide();
    };

    var showElement = function (id) {
        resetForm("form-update-place");
        var element = that.model.items[id];
        $.each(element, function (name, value) {
            $('#input-place-' + name).val(value);
        });
        
        mapServiceForm.showMap("map-canvas-form", element.latitude, element.longitude, true);
        
        $("#delete-place").show();
    };

    var resetForm = function (form) {
        var div = $("#" + form);
        div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
        div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected').checkboxradio('refresh');
    };
    
    var hideListDisplay = function () {
        $('#list-places-parent').removeClass('visible');
        $('#list-places-parent').addClass('invisible');
    };

    var showMapDisplay = function () {
        $('#map-places-parent').removeClass('invisible');
        $('#map-places-parent').addClass('visible');
    };

    var  showListDisplay = function () {
        $('#list-places-parent').removeClass('invisible');
        $('#list-places-parent').addClass('visible');
    };

    var hideMapDisplay = function () {
        $('#map-places-parent').removeClass('visible');
        $('#map-places-parent').addClass('invisible');
    };
    

    var renderList = function () {
        
        mapServiceList = grails.mobile.map.googleMapService();
        mapServiceList.emptyMap("map-canvas-list");
        
        var key, items = model.getItems();
        for (key in items) {
            renderElement(items[key]);
        }
        $('#list-places').listview('refresh');
        
        mapServiceList.refreshCenterZoomMap();
        
    };

    var renderElement = function (element) {
        if (element.offlineStatus !== 'delete') {
            var a = $('<a>').attr({ href: '#section-show-place?id=' + element.id });
            a.attr({id : 'place' + element.id + '-in-list'});
            a.attr({'data-transition': 'fade' });
            a.text(getText(element));
            $("#list-places").append($('<li>').append(a));
            
            mapServiceList.addMarkers(element);
            
        }
    };

    var getText = function (data) {
        var textDisplay = '';
        $.each(data, function (name, value) {
            if (name !== 'class' && name !== 'id' && name !== 'offlineStatus' && name !== 'status' && name !== 'version') {
                textDisplay += value + ";";
            }
        });
        return textDisplay.substring(0, textDisplay.length - 1);
    };

    return that;
};