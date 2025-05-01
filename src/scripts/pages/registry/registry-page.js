import StoriesAPI from "../../data/api";
import registryPresenter from "./registry-controller";

export default class registryPage {
  async render() {
    return `
      <section class="container">
        <div class="skip-link">
          <a href="#content" class="skip-to-content">Skip to content</a>
        </div>
        <h1 id="content" tabindex="0">Registrasi</h1>
        
        <form id="registry-form" class="auth-form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="8">
            <small class="form-helper">Password harus minimal 8 karakter</small>
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
        const response = await registryPresenter.registry({ name, email, password });
        alert("Registrasi berhasil!");
        // Redirect setelah registrasi berhasil
        window.location.href = '/login'; // Arahkan ke halaman login
      } catch (error) {
        alert("Registrasi gagal. Silakan coba lagi.");
      }
    });
  }
}
