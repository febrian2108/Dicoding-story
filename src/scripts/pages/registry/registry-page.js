import StoriesAPI from "../../data/api";
import registryPresenter from "./registry-controller";

export default class registryPage {
  async render() {
    return `
      <section class="container">
        <div class="skip-link">
          <a href="#content" class="skip-to-content">Skip to content</a>
        </div>
        <h1 id="content" tabindex="0">Registry</h1>
        
        <form id="registry-form" class="auth-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
            <small class="form-helper">Password must be at least 8 characters</small>
          </div>
          
          <div class="form-actions">
            <button type="submit" id="registry-button" class="submit-button">Registry</button>
          </div>
          
          <p class="auth-link">Already have an account? <a href="#/login">Login here</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById("registry-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const registryButton = document.getElementById("registry-button");
        registryButton.disabled = true;
        registryButton.textContent = "registrying...";

        const response = await StoriesAPI.registry({
          name,
          email,
          password,
        });

        if (response.error) {
          alert(`Registration failed: ${response.message}`);
        } else {
          alert("Registration successful! Please login with your new account.");
          window.location.hash = "#/login";
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Registration failed. Please try again.");
      } finally {
        const registryButton = document.getElementById("registry-button");
        registryButton.disabled = false;
        registryButton.textContent = "registry";
      }
    });
  }
}