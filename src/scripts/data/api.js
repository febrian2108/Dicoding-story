import CONFIG from "../config";

const ENDPOINTS = {
  registry: `${CONFIG.BASE_URL}/registry`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  GUEST_STORY: `${CONFIG.BASE_URL}/stories/guest`,
};

const StoriesAPI = {
  async registry({ name, email, password }) {
    const response = await fetch(ENDPOINTS.registry, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    return await response.json();
  },

  async login({ email, password }) {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();

    if (!responseJson.error) {
<<<<<<< HEAD
      // simpan ke local storage
=======
      // Simpan ke local storage
>>>>>>> origin/main
      localStorage.setItem("user", JSON.stringify(responseJson.loginResult));
    }

    return responseJson;
  },

  async getStories(page = 1, size = 10, location = 0) {
<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem("user")) || {};
=======
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      window.location.href = "/login";  
      return;
    }
>>>>>>> origin/main

    const response = await fetch(
      `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`,
      {
        headers: {
<<<<<<< HEAD
          Authorization: `Bearer ${
            user.token ||
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLW1wQXE3ZGRTcmdFVnFsWFoiLCJpYXQiOjE3NDU5NDAwMzV9.AO4faCUymXCQF3_6e3TsE537CbEPIAlfGRNWYcEjX9g"
          }`,
=======
          Authorization: `Bearer ${user.token}`,
>>>>>>> origin/main
        },
      }
    );

    return await response.json();
  },

  async getGuestStories(page = 1, size = 10, location = 0) {
    const response = await fetch(
      `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`
    );

    return await response.json();
  },

  async getStoryDetail(id) {
<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${
          user.token ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLW1wQXE3ZGRTcmdFVnFsWFoiLCJpYXQiOjE3NDU5NDAwMzV9.AO4faCUymXCQF3_6e3TsE537CbEPIAlfGRNWYcEjX9g"
        }`,
=======
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      window.location.href = "/login";  
      return;
    }

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      headers: {
        Authorization: `Bearer ${user.token}`,
>>>>>>> origin/main
      },
    });

    return await response.json();
  },

  async addStory({ description, photo, lat, lon }) {
<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem("user")) || {};
=======
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      window.location.href = "/login";  
      return;
    }
>>>>>>> origin/main

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== undefined && lon !== undefined) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(ENDPOINTS.STORIES, {
      method: "POST",
      headers: {
<<<<<<< HEAD
        Authorization: `Bearer ${
          user.token ||
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLW1wQXE3ZGRTcmdFVnFsWFoiLCJpYXQiOjE3NDU5NDAwMzV9.AO4faCUymXCQF3_6e3TsE537CbEPIAlfGRNWYcEjX9g"
        }`,
=======
        Authorization: `Bearer ${user.token}`,
>>>>>>> origin/main
      },
      body: formData,
    });

    return await response.json();
  },

  async addGuestStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== undefined && lon !== undefined) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(ENDPOINTS.GUEST_STORY, {
      method: "POST",
      body: formData,
    });

    return await response.json();
  },

  checkAuth() {
<<<<<<< HEAD
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return !!user.token;
=======
    const user = JSON.parse(localStorage.getItem("user"));
    return !!user?.token;
>>>>>>> origin/main
  },

  logout() {
    localStorage.removeItem("user");
<<<<<<< HEAD
  },
};

export default StoriesAPI;
=======
    window.location.href = "/login";  
  },
};

export default StoriesAPI;
>>>>>>> origin/main
