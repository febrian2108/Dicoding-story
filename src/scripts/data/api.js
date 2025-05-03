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

    if (response.ok && !responseJson.error) {
      // Simpan token ke localStorage
      localStorage.setItem("user", JSON.stringify(responseJson.loginResult));
    }

    return responseJson;
  },

  async getStories(page = 1, size = 10, location = 0) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      // Jika pengguna tidak login, tampilkan alert dan arahkan
      if (window.location.pathname !== "/login") {
        alert("Kamu harus login jika ingin melihat data dari API");
        window.location.href = "https://your-app-name.vercel.app/login#/login";  // Sesuaikan dengan pengaturan routing Anda
      }
      return;
    }

    try {
      const response = await fetch(
        `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Terjadi kesalahan saat mengambil data cerita. Coba lagi nanti.');
      }

      const responseJson = await response.json();

      // Pastikan responseJson ada dan dalam format yang benar
      if (responseJson) {
        return responseJson;
      } else {
        throw new Error('Format respons tidak valid.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      return { error: error.message || 'Terjadi kesalahan saat memuat data.' };
    }
  },

  async getGuestStories(page = 1, size = 10, location = 0) {
    try {
      const response = await fetch(
        `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`
      );

      if (!response.ok) {
        throw new Error('Terjadi kesalahan saat mengambil data cerita tamu.');
      }

      const responseJson = await response.json();

      if (responseJson) {
        return responseJson;
      } else {
        throw new Error('Format respons tidak valid.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      return { error: error.message || 'Terjadi kesalahan saat mengambil cerita tamu.' };
    }
  },

  async getStoryDetail(id) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      // Jika pengguna tidak login, tampilkan alert dan arahkan
      if (window.location.pathname !== "/login") {
        alert("Kamu harus login jika ingin melihat data dari API");
        window.location.href = "https://your-app-name.vercel.app/login#/login";  // Sesuaikan dengan pengaturan routing Anda
      }
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Terjadi kesalahan saat mengambil detail cerita.');
      }

      const responseJson = await response.json();

      if (responseJson) {
        return responseJson;
      } else {
        throw new Error('Format respons tidak valid.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      return { error: error.message || 'Terjadi kesalahan saat mengambil detail cerita.' };
    }
  },

  async addStory({ description, photo, lat, lon }) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      // Jika pengguna tidak login, tampilkan alert dan arahkan
      if (window.location.pathname !== "/login") {
        alert("Kamu harus login jika ingin melihat data dari API");
        window.location.href = "https://your-app-name.vercel.app/login#/login";  // Sesuaikan dengan pengaturan routing Anda
      }
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== undefined && lon !== undefined) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    try {
      const response = await fetch(ENDPOINTS.STORIES, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Terjadi kesalahan saat menambahkan cerita.');
      }

      const responseJson = await response.json();

      if (responseJson) {
        return responseJson;
      } else {
        throw new Error('Format respons tidak valid.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      return { error: error.message || 'Terjadi kesalahan saat menambahkan cerita.' };
    }
  },

  async addGuestStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== undefined && lon !== undefined) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    try {
      const response = await fetch(ENDPOINTS.GUEST_STORY, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Terjadi kesalahan saat menambahkan cerita tamu.');
      }

      const responseJson = await response.json();

      if (responseJson) {
        return responseJson;
      } else {
        throw new Error('Format respons tidak valid.');
      }
    } catch (error) {
      console.error('Error:', error.message);
      return { error: error.message || 'Terjadi kesalahan saat menambahkan cerita tamu.' };
    }
  },

  checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"));
    return !!user && !!user.token;
  },

  logout() {
    localStorage.removeItem("user");
    // Redirect to login page after logout
    window.location.href = "https://your-app-name.vercel.app/login#/login";  // Sesuaikan dengan pengaturan routing Anda
  },
};

export default StoriesAPI;
