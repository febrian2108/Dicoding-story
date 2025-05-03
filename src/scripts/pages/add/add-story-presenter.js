import StoriesAPI from "../../data/api";

const AddPresenter = {
    async add({ description, photo, lat, lon }) {
        if (StoriesAPI.checkAuth()) {
            return StoriesAPI.addStory({ description, photo, lat, lon });
        } else {
            return StoriesAPI.addGuestStory({ description, photo, lat, lon });
        }
    },
};

export default AddPresenter;