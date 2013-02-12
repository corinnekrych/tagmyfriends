package tagmyfriends

class Checkin {
    String description
    Place place
    static hasMany = [friends:Friend]
    static constraints = {
    }
}
