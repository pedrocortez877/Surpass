import Area from "../models/Area";
import images_view from './images_view'

export default {
    render(area: Area){
        return {
            id: area.id,
            name: area.name,
            latitude: area.latitude,
            longitude: area.longitude,
            about: area.about,
            instructions: area.instructions,
            opening_hours: area.opening_hours,
            open_on_weekends: area.open_on_weekends,
            images: images_view.renderMany(area.images)
        };
    },

    renderMany(area: Area[]){
        return area.map(area => this.render(area))
    }
}