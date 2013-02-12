package tagmyfriends


import grails.converters.JSON
import grails.validation.ValidationErrors
import groovy.json.JsonBuilder;

import org.codehaus.groovy.grails.web.json.JSONObject;
import org.springframework.dao.DataIntegrityViolationException

class FriendController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
      render Friend.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.friend)
      
      Friend friendInstance = new Friend(jsonObject)

      
      if (!friendInstance.save(flush: true)) {
        ValidationErrors validationErrors = friendInstance.errors
        render validationErrors as JSON
        return
      }

      event topic:"save-friend", data: friendInstance

      render friendInstance as JSON
    }
    
    def show() {
      def friendInstance = Friend.get(params.id)
      if (!friendInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'friend.label', default: 'Friend'), params.id])
        render flash as JSON
        return
      }
      render FriendInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.friend)
        
        Friend friendReceived = new Friend(jsonObject)
        
        def friendInstance = Friend.get(jsonObject.id)
        if (!friendInstance) {
          flash.message = message(code: 'default.not.found.message', args: [message(code: 'friend.label', default: 'Friend'), params.id])
          render flash as JSON
          return
        }

        if (jsonObject.version) {
          def version = jsonObject.version.toLong()
          if (friendInstance.version > version) {
            friendInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                                                             [message(code: 'friend.label', default: 'Friend')] as Object[],
                                                             "Another user has updated this Friend while you were editing")
              ValidationErrors validationErrors = friendInstance.errors
              render validationErrors as JSON
              return
          }
        }

        friendInstance.properties = friendReceived.properties

        if (!friendInstance.save(flush: true)) {
          ValidationErrors validationErrors = friendInstance.errors
          render validationErrors as JSON
          return
        }

        event topic:"update-friend", data: friendInstance

        render friendInstance as JSON
    }

    def delete() {
      def friendInstance = Friend.get(params.id)
      
      if (!friendInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'friend.label', default: 'Friend'), params.id])
        render flash as JSON
        return
      }
      try {
        friendInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'friend.label', default: 'Friend'), params.id])
        render flash as JSON
        return
      }

      event topic:"delete-friend", data: friendInstance

      render friendInstance as JSON
    }
}
