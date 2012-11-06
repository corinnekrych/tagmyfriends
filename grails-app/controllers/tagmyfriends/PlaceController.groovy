package tagmyfriends


import grails.converters.JSON
import grails.validation.ValidationErrors
import groovy.json.JsonBuilder;

import org.codehaus.groovy.grails.web.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException

class PlaceController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
     	render Place.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.place)
      Place placeInstance = new Place(jsonObject)
      if (!placeInstance.save(flush: true)) {
        ValidationErrors validationErrors = placeInstance.errors
        render validationErrors as JSON
      }
      render placeInstance as JSON
    }
    
    def show() {
      def placeInstance = Place.get(params.id)
      if (!placeInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'place.label', default: 'Place'), params.id])
        render flash as JSON
      }
      render PlaceInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.place)
      Place placeReceived = new Place(jsonObject)

        def placeInstance = Place.get(jsonObject.id)
        if (!placeInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'place.label', default: 'Place'), params.id])
            render flash as JSON
        }

        if (jsonObject.version) {
          def version = jsonObject.version.toLong()
          if (placeInstance.version > version) {
            placeInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                          [message(code: 'place.label', default: 'Place')] as Object[],
                          "Another user has updated this Place while you were editing")
                ValidationErrors validationErrors = placeInstance.errors
                render validationErrors as JSON
                return
            }
        }

        placeInstance.properties = placeReceived.properties

        if (!placeInstance.save(flush: true)) {
          ValidationErrors validationErrors = placeInstance.errors
          render validationErrors as JSON
        }
		    render placeInstance as JSON
    }

    def delete() {
      def placeId = params.id
      def placeInstance = Place.get(params.id)
      if (!placeInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'place.label', default: 'Place'), params.id])
        render flash as JSON
      }
      try {
            placeInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'place.label', default: 'Place'), params.id])
        render flash as JSON
      }
      render placeInstance as JSON
    }
}
