import StoriesAPI from "../../data/api";

const registryPresenter = {
  async registry({ name, email, password }) {
    try {
      const response = await StoriesAPI.registry({ name, email, password });
      console.log("Registrasi berhasil:", response);
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      console.error("Registrasi gagal:", error.message);
      throw error;
    }
  },
};

export default registryPresenter;
