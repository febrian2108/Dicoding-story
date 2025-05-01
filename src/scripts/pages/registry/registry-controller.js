import StoriesAPI from "../../data/api";

const registryPresenter = {
  async registry({ name, email, password }) {
    return StoriesAPI.registry({ name, email, password });
  },
};
console.log("Registry response:", response);

export default registryPresenter;