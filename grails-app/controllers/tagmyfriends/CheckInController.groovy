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
      Checkin checkinInstance = new Checkin(jsonObject)
      if (!checkinInstance.save(flush: true)) {
        ValidationErrors validationErrors = checkinInstance.errors
        render validationErrors as JSON
      }
      render checkinInstance as JSON
    }
    
    def show() {
      def checkinInstance = Checkin.get(params.id)
      if (!checkinInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
        render flash as JSON
      }
      render CheckinInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.checkin)
      Checkin checkinReceived = new Checkin(jsonObject)

        def checkinInstance = Checkin.get(jsonObject.id)
        if (!checkinInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
            render flash as JSON
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
        }
		    render checkinInstance as JSON
    }

    def delete() {
      def checkinId = params.id
      def checkinInstance = Checkin.get(params.id)
      if (!checkinInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
        render flash as JSON
      }
      try {
            checkinInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
        render flash as JSON
      }
      render checkinInstance as JSON
    }
}
