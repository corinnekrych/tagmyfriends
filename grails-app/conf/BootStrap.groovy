import tagmyfriends.Friend
import tagmyfriends.Place

class BootStrap {

    def init = { servletContext ->
        Friend sebi = new Friend()
        sebi.firstname = "Sebi"
        sebi.lastname = "Blanc"
        sebi.registrationDate = new Date()
        sebi.save()

        Friend faboo = new Friend()
        faboo.firstname = "Fabrice"
        faboo.lastname = "Matrat"
        faboo.registrationDate = new Date() - 3
        faboo.save()

        Friend corinne = new Friend()
        corinne.firstname = "Corinne"
        corinne.lastname = "Krych"
        corinne.registrationDate = new Date() - 5
        corinne.save()


        Place sophia = new Place("Sophia", 43.623027, 7.071504).save()
        Place plageDeLaPinede = new Place("Beach", 43.566539, 7.113925).save()
    }
    def destroy = {
    }
}
