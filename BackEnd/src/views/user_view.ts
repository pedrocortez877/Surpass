import Users from "../models/Users";

export default {
    render(user: Users){
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    },

    renderMany(user: Users[]){
        return user.map(user => this.render(user))
    }
}