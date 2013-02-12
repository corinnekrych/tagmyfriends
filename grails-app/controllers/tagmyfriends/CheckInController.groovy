package tagmyfriends


import grails.converters.JSON
import grails.validation.ValidationErrors
import groovy.json.JsonBuilder;

import org.codehaus.groovy.grails.web.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException

class CheckinController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        render Checkin.list(params) as JSON
    }

    def save() {
        def jsonObject = JSON.parse(params.checkin)

        def friends = []
        jsonObject.friends.each() {
            String id = it.id
            Friend friend = Friend.get(id)
            friends.add(friend)
        }
        jsonObject.friends = null

        Checkin checkinInstance = new Checkin(jsonObject)


        checkinInstance.friends = friends

        if (!checkinInstance.save(flush: true)) {
            ValidationErrors validationErrors = checkinInstance.errors
            render validationErrors as JSON
            return
        }

        event topic: "save-checkin", data: checkinInstance

        render checkinInstance as JSON
    }

    def show() {
        def checkinInstance = Checkin.get(params.id)
        if (!checkinInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
            render flash as JSON
            return
        }
        render CheckinInstance as JSON
    }

    def update() {
        def jsonObject = JSON.parse(params.checkin)

        def friends = []
        jsonObject.friends.each() {
            String id = it.id
            Friend friend = Friend.get(id)
            friends.add(friend)
        }
        jsonObject.friends = null

        Checkin checkinReceived = new Checkin(jsonObject)

        checkinReceived.friends = friends

        def checkinInstance = Checkin.get(jsonObject.id)
        if (!checkinInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
            render flash as JSON
            return
        }

        if (jsonObject.version) {
            def version = jsonObject.version.toLong()
            if (checkinInstance.version > version) {
                checkinInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                        [message(code: 'checkin.label', default: 'Checkin')] as Object[],
                        "Another user has updated this Checkin while you were editing")
                ValidationErrors validationErrors = checkinInstance.errors
                render validationErrors as JSON
                return
            }
        }

        checkinInstance.properties = checkinReceived.properties

        if (!checkinInstance.save(flush: true)) {
            ValidationErrors validationErrors = checkinInstance.errors
            render validationErrors as JSON
            return
        }

        event topic: "update-checkin", data: checkinInstance

        render checkinInstance as JSON
    }

    def delete() {
        def checkinInstance = Checkin.get(params.id)

        checkinInstance.friends.each() {
            Friend.get(it.getId());
        }

        if (!checkinInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
            render flash as JSON
            return
        }
        try {
            checkinInstance.delete(flush: true)
        }
        catch (DataIntegrityViolationException e) {
            flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
            render flash as JSON
            return
        }

        event topic: "delete-checkin", data: checkinInstance

        render checkinInstance as JSON
    }
}
