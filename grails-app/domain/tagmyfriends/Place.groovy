package tagmyfriends

class Place {
    String name
    Double latitude
    Double longitude
    Place(name, latitude, longitude) {
        this.name = name
        this.latitude = latitude
        this.longitude = longitude
    }
    static constraints = {
        name()
        longitude nullable: true, blank: true
        latitude nullable: true, blank: true
    }
}
