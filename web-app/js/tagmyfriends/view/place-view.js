


var tagmyfriends = tagmyfriends || {};
tagmyfriends.view = tagmyfriends.view || {};

tagmyfriends.view.placeview = function (model, elements) {

    var that = grails.mobile.mvc.view(model, elements);
    
    // Register events
    that.model.listedItems.attach(function (data) {
        renderList();
    });

    that.model.createdItem.attach(function (data) {
        renderElement(data.item);
        $('#list-places').listview('refresh');
    	
    });

    that.model.updatedItem.attach(function (data) {
         renderList();
    });

    that.model.deletedItem.attach(function (data) {
        $('#place' + data.item.id + '-in-list').parents('li').remove();
        
    });

    // user interface actions
    
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
        
        $("#delete-place").hide();
    };

    var showElement = function (id) {
        resetForm("form-update-place");
        var element = that.model.items[id];
        $.each(element, function (name, value) {
            $('#input-place-' + name).val(value);
        });
        
        $("#delete-place").show();
    };

    var resetForm = function (form) {
        var div = $("#" + form);
        div.find('input:text, input:hidden, input[type="number"], input:file, input:password').val('');
        div.find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected').checkboxradio('refresh');
    };
    

    var renderList = function () {
        
        $('#list-places').empty();
        var key, items = model.getItems();
        for (key in items) {
            renderElement(items[key]);
        }
        $('#list-places').listview('refresh');
        
    };

    var renderElement = function (element) {
        if (element.offlineAction !== 'DELETED') {
            var a = $('<a>').attr({ href: '#section-show-place?id=' + element.id });
            a.attr({id : 'place' + element.id + '-in-list'});
            a.attr({'data-transition': 'fade' });
            a.text(getText(element));
            if (element.offlineStatus === "NOT-SYNC") {
                $("#list-places").append($('<li data-theme="e">').append(a));
            } else {
                $("#list-places").append($('<li>').append(a));
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