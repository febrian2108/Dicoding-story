import StoriesAPI from "../../data/api";

<<<<<<< HEAD
const AddController = {
=======
const AddPresenter = {
>>>>>>> origin/main
    async add({ description, photo, lat, lon }) {
        if (StoriesAPI.checkAuth()) {
            return StoriesAPI.addStory({ description, photo, lat, lon });
        } else {
            return StoriesAPI.addGuestStory({ description, photo, lat, lon });
        }
    },
};

<<<<<<< HEAD
export default AddController;
=======
export default AddPresenter;
>>>>>>> origin/main
