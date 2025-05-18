import api from "./api.js";
import API_CONFIG from "../config/api-config.js";

class StoryRepository {
    async getStories({ page, size, location } = {}) {
        return api.get(API_CONFIG.ENDPOINTS.STORIES, { page, size, location });
    }

    async getStoryById(id) {
        if (!id) {
            throw new Error("Story ID is required");
        }

        return api.get(`${API_CONFIG.ENDPOINTS.STORIES}/${id}`);
    }

    async addStory({ description, photo, lat, lon }, useAuth = true) {
        if (!description || !photo) {
            throw new Error("Description and photo are required");
        }

        const endpoint = useAuth
            ? API_CONFIG.ENDPOINTS.STORIES
            : API_CONFIG.ENDPOINTS.GUEST_STORY;

        const formData = new FormData();
        formData.append("description", description);
        formData.append("photo", photo);

        if (lat !== undefined && lon !== undefined) {
            formData.append("lat", lat);
            formData.append("lon", lon);
        }

        return api.postForm(endpoint, formData, useAuth);
    }

    async subscribeToPushNotifications(subscription) {
        return api.post(API_CONFIG.ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, subscription);
    }

    async unsubscribeFromPushNotifications(endpoint) {
        return api.delete(API_CONFIG.ENDPOINTS.NOTIFICATIONS_SUBSCRIBE, {
            endpoint,
        });
    }
}

const storyRepository = new StoryRepository();
export default storyRepository;
