export default class AboutPage {
  async render() {
    return `
      <section class="container">
        <div class="skip-link">
          <a href="#content" class="skip-to-content">Skip to content</a>
        </div>
        <h1 id="content" tabindex="0">About Story Apps</h1>
        
        <div class="about-content">
          <p>Story Apps an application created for sharing stories.</p>
          
          <h2>Features</h2>
          <ul>
            <li>Share other Dicoding student stories</li>
            <li>Create and share your own stories with photos</li>
            <li>Add location information to your stories</li>
            <li>View stories on an interactive map</li>
          </ul>
      </section>
    `;
  }
}