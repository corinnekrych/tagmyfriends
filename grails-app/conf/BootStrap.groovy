import tagmyfriends.Friend
import tagmyfriends.Place

class BootStrap {

    def init = { servletContext ->

        Friend fabrice = new Friend(firstname: "Fabrice", lastname: "Matrat", registrationDate: new Date())
        fabrice.save()

        Friend sebastien = new Friend(firstname: "Sebastien", lastname: "Blanc", registrationDate: new Date())
        sebastien.save()

        Place nice = new Place(description: "Nice", latitude:43.7, longitude: 7.2 )
        nice.save()

        Place paris = new Place(description: "Paris", latitude:48.8, longitude: 2.3 )
        paris.save()

        Place madrid = new Place(description: "Madrid", latitude:40.4, longitude: -3.68 )
        madrid.save()

    }
    def destroy = {
    }
}
