import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";
import Auth from "../utils/auth";
import CameraUtils from "../utils/camera";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupAuth();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  #setupAuth() {
    const navList = document.getElementById("nav-list");

    navList.innerHTML = `
      <li><a href="#">Home</a></li>
      <li><a href="#/add">Add Story</a></li>
      <li><a href="#/about">About</a></li>
    `;

    const authNav = document.createElement("div");
    authNav.className = "auth-nav";

    const loginButton = document.createElement("a");
    loginButton.href = "#/login";
    loginButton.textContent = "Login";
    loginButton.id = "login-button";
    loginButton.className = "auth-button";

    const registryButton = document.createElement("a");
    registryButton.href = "#/registry";
    registryButton.textContent = "Registry";
    registryButton.id = "registry-button";
    registryButton.className = "auth-button";

    const logoutButton = document.createElement("a");
    logoutButton.href = "#";
    logoutButton.textContent = "Logout";
    logoutButton.id = "logout-button";
    logoutButton.className = "auth-button";

    authNav.appendChild(loginButton);
    authNav.appendChild(registryButton);
    authNav.appendChild(logoutButton);

    const authLi = document.createElement("li");
    authLi.appendChild(authNav);
    navList.appendChild(authLi);

    Auth.init({
      loginButton,
      logoutButton,
      registryButton,
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    if (!page) {
      this.#content.innerHTML =
        '<div class="container"><h1>Page Not Found</h1><p>The page you are looking for does not exist.</p></div>';
      return;
    }

    if (document.startViewTransition) {
      const transition = document.startViewTransition(async () => {
        CameraUtils.clean?.();
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });

      await transition.finished;
    } else {
      CameraUtils.clean?.();
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    }
  }
}

export default App;