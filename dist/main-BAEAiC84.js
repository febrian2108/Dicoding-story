var S=Object.defineProperty;var k=(c,e,t)=>e in c?S(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var p=(c,e,t)=>k(c,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();window.addEventListener("online",()=>{document.getElementById("offline-indicator").classList.remove("show")});window.addEventListener("offline",()=>{document.getElementById("offline-indicator").classList.add("show")});let g;window.addEventListener("beforeinstallprompt",c=>{c.preventDefault(),g=c,document.getElementById("pwa-install-banner").classList.add("show")});document.getElementById("install-pwa").addEventListener("click",()=>{g&&(g.prompt(),g.userChoice.then(()=>{g=null}),document.getElementById("pwa-install-banner").classList.remove("show"))});document.getElementById("close-banner").addEventListener("click",()=>{document.getElementById("pwa-install-banner").classList.remove("show")});navigator.onLine||document.getElementById("offline-indicator").classList.add("show");class h{static getUserData(){const e=localStorage.getItem("userData");return e?JSON.parse(e):null}static setUserData(e){localStorage.setItem("userData",JSON.stringify(e))}static getToken(){const e=this.getUserData();return e?e.token:null}static getUserId(){const e=this.getUserData();return e?e.userId:null}static getUserName(){const e=this.getUserData();return e?e.name:null}static isLoggedIn(){return!!this.getToken()}static logout(){localStorage.removeItem("userData")}}class v{constructor(){this._baseUrl="https://story-api.dicoding.dev/v1"}async getStories(e=1,t=10,r=0){try{const o=h.getToken();if(!o)throw new Error("Anda belum login");console.log(`Fetching stories: page=${e}, size=${t}, location=${r}`);const i=await(await fetch(`${this._baseUrl}/stories?page=${e}&size=${t}&location=${r}`,{headers:{Authorization:`Bearer ${o}`}})).json();if(i.error)throw new Error(i.message);return console.log("Stories fetched:",i.listStory.length),i.listStory}catch(o){throw console.error("Error getting stories:",o),new Error(o.message||"Gagal mengambil daftar cerita")}}async getStoryDetail(e){try{const t=h.getToken();if(!t)throw new Error("Anda belum login");console.log("Fetching story detail for ID:",e);const o=await(await fetch(`${this._baseUrl}/stories/${e}`,{headers:{Authorization:`Bearer ${t}`}})).json();if(o.error)throw new Error(o.message);return console.log("Story detail fetched"),o.story}catch(t){throw console.error("Error getting story detail:",t),new Error(t.message||"Gagal mengambil detail cerita")}}async addStory(e,t,r=null,o=null){try{const a=h.getToken(),i=new FormData;i.append("description",e),i.append("photo",t),r!==null&&o!==null&&(i.append("lat",r),i.append("lon",o));const n=a?`${this._baseUrl}/stories`:`${this._baseUrl}/stories/guest`,s=a?{Authorization:`Bearer ${a}`}:{};console.log("Adding new story",a?"with auth":"as guest");const d=await(await fetch(n,{method:"POST",headers:s,body:i})).json();if(d.error)throw new Error(d.message);return console.log("Story added successfully"),d}catch(a){throw console.error("Error adding story:",a),new Error(a.message||"Gagal menambahkan cerita")}}}class B{constructor(e,t){this._config=e,this._view=t}async getStories(){try{this._view.showLoading();const e=await this._config.getStories(1,10,1);this._view.renderStories(e)}catch(e){console.error("Home presenter error:",e),this._view.showError(e.message)}}}class m{static async openDB(){return new Promise((e,t)=>{if(!("indexedDB"in window)){t(new Error("Browser tidak mendukung IndexedDB"));return}const r=indexedDB.open(this.DB_NAME,this.DB_VERSION);r.onerror=o=>{console.error("IndexedDB error:",o.target.error),t(new Error("Gagal membuka database"))},r.onsuccess=()=>{e(r.result)},r.onupgradeneeded=o=>{const a=o.target.result;a.objectStoreNames.contains(this.STORE_STORIES)||(a.createObjectStore(this.STORE_STORIES,{keyPath:"id"}),console.log(`Object store ${this.STORE_STORIES} berhasil dibuat`)),a.objectStoreNames.contains(this.STORE_FAVORITES)||(a.createObjectStore(this.STORE_FAVORITES,{keyPath:"id"}),console.log(`Object store ${this.STORE_FAVORITES} berhasil dibuat`))}})}static async saveStories(e){const r=(await this.openDB()).transaction(this.STORE_STORIES,"readwrite"),o=r.objectStore(this.STORE_STORIES);return e.forEach(a=>{o.put(a)}),new Promise((a,i)=>{r.oncomplete=()=>{console.log("Stories berhasil disimpan ke IndexedDB"),a(e)},r.onerror=n=>{console.error("Error menyimpan stories:",n.target.error),i(new Error("Gagal menyimpan stories ke IndexedDB"))}})}static async getStories(){const o=(await this.openDB()).transaction(this.STORE_STORIES,"readonly").objectStore(this.STORE_STORIES).getAll();return new Promise((a,i)=>{o.onsuccess=()=>{a(o.result)},o.onerror=n=>{console.error("Error mengambil stories:",n.target.error),i(new Error("Gagal mengambil stories dari IndexedDB"))}})}static async getStoryById(e){const a=(await this.openDB()).transaction(this.STORE_STORIES,"readonly").objectStore(this.STORE_STORIES).get(e);return new Promise((i,n)=>{a.onsuccess=()=>{i(a.result)},a.onerror=s=>{console.error("Error mengambil story:",s.target.error),n(new Error("Gagal mengambil story dari IndexedDB"))}})}static async deleteStory(e){const a=(await this.openDB()).transaction(this.STORE_STORIES,"readwrite").objectStore(this.STORE_STORIES).delete(e);return new Promise((i,n)=>{a.onsuccess=()=>{console.log(`Story dengan id ${e} berhasil dihapus dari IndexedDB`),i(!0)},a.onerror=s=>{console.error("Error menghapus story:",s.target.error),n(new Error(`Gagal menghapus story dengan id ${e} dari IndexedDB`))}})}static async clearStories(){const o=(await this.openDB()).transaction(this.STORE_STORIES,"readwrite").objectStore(this.STORE_STORIES).clear();return new Promise((a,i)=>{o.onsuccess=()=>{console.log("Semua stories berhasil dihapus dari IndexedDB"),a(!0)},o.onerror=n=>{console.error("Error menghapus semua stories:",n.target.error),i(new Error("Gagal menghapus semua stories dari IndexedDB"))}})}static async addToFavorites(e){const o=(await this.openDB()).transaction(this.STORE_FAVORITES,"readwrite").objectStore(this.STORE_FAVORITES);return new Promise((a,i)=>{const n=o.put(e);n.onsuccess=()=>{console.log("Story berhasil ditambahkan ke favorit"),a(!0)},n.onerror=s=>{console.error("Error menambahkan favorit:",s.target.error),i(new Error("Gagal menambahkan story ke favorit"))}})}static async removeFromFavorites(e){const o=(await this.openDB()).transaction(this.STORE_FAVORITES,"readwrite").objectStore(this.STORE_FAVORITES);return new Promise((a,i)=>{const n=o.delete(e);n.onsuccess=()=>{console.log("Story berhasil dihapus dari favorit"),a(!0)},n.onerror=s=>{console.error("Error menghapus favorit:",s.target.error),i(new Error("Gagal menghapus story dari favorit"))}})}static async getFavorites(){const r=(await this.openDB()).transaction(this.STORE_FAVORITES,"readonly").objectStore(this.STORE_FAVORITES);return new Promise((o,a)=>{const i=r.getAll();i.onsuccess=()=>{o(i.result)},i.onerror=n=>{console.error("Error mengambil favorit:",n.target.error),a(new Error("Gagal mengambil daftar favorit"))}})}static async isFavorite(e){const o=(await this.openDB()).transaction(this.STORE_FAVORITES,"readonly").objectStore(this.STORE_FAVORITES);return new Promise((a,i)=>{const n=o.get(e);n.onsuccess=()=>{a(!!n.result)},n.onerror=s=>{console.error("Error memeriksa favorit:",s.target.error),i(new Error("Gagal memeriksa status favorit"))}})}}p(m,"DB_NAME","storyapps-db"),p(m,"DB_VERSION",1),p(m,"STORE_STORIES","stories"),p(m,"STORE_FAVORITES","favorites");class I{constructor(){this._config=new v,this._presenter=null,this._showFavorites=!1,this._title="StoryApps"}async render(){return document.title=this._title,`
      <section class="home-page page-transition">
        <div class="coordinator-layout">
          <div class="coordinator-header">
            <div>
              <h2 class="coordinator-title">Cerita Terbaru</h2>
              <p>Jelajahi dan bagikan cerita menarik dari komunitas Dicoding</p>
            </div>
          </div>
          <div id="stories-container" class="coordinator-grid">
            <div class="loader" id="stories-loader"></div>
          </div>
          <div id="error-container" class="error-container hidden"></div>
        </div>
      </section>
    `}async afterRender(){this._presenter=new B(this._config,this);const e=document.getElementById("toggle-favorites");e&&e.addEventListener("click",()=>{this._showFavorites=!this._showFavorites,this._refreshContent()}),await this._presenter.getStories()}async _refreshContent(){const e=document.getElementById("toggle-favorites"),t=document.querySelector(".coordinator-title");if(this._showFavorites)try{this.showLoading();const r=await m.getFavorites();this.renderStories(r),e&&(e.innerHTML='<i class="fas fa-list"></i> Semua Cerita'),t&&(t.textContent="Cerita Favorit")}catch(r){console.error("Error loading favorites:",r),this.showError("Gagal memuat cerita favorit")}else e&&(e.innerHTML='<i class="fas fa-bookmark"></i> Cerita Favorit'),t&&(t.textContent="Cerita Terbaru"),await this._presenter.getStories()}showLoading(){const e=document.getElementById("stories-loader");e&&e.classList.remove("hidden");const t=document.getElementById("error-container");t&&t.classList.add("hidden");const r=document.getElementById("stories-container");r&&[...r.children].forEach(o=>{o.id!=="stories-loader"&&o.remove()})}hideLoading(){const e=document.getElementById("stories-loader");e&&e.classList.add("hidden")}async renderStories(e){this.hideLoading();const t=document.getElementById("stories-container");if(t){if(e.length===0){t.innerHTML=`
        <div class="empty-state">
          <p>${this._showFavorites?"Belum ada cerita favorit.":"Belum ada cerita yang dibagikan."}</p>
        </div>
      `;return}t.innerHTML="";for(const r of e){const o=r.name?r.name.charAt(0).toUpperCase():"?",a=await m.isFavorite(r.id),i=document.createElement("article");i.classList.add("story-card"),i.innerHTML=`
        <div class="story-image-container">
          <img
            src="${r.photoUrl}"
            alt="Cerita dari ${r.name}"
            class="story-image"
            loading="lazy"
            onerror="this.src='./src/public/fallback.jpg';"
          />
        </div>
        <div class="story-content">
          <div class="user-info">
            <div class="user-avatar">${o}</div>
            <span class="user-name">${r.name}</span>
          </div>
          <h3 class="story-title">${r.name}</h3>
          <p class="story-description">${this._truncateText(r.description,100)}</p>
          <div class="story-meta">
            <div class="story-info">
              <i class="fas fa-calendar-alt"></i>
              <span>${this._formatDate(r.createdAt)}</span>
            </div>
            ${r.lat&&r.lon?`
              <div class="story-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>Lokasi tersedia</span>
              </div>`:""}
          </div>
          <div class="story-actions">
            <button class="favorite-btn ${a?"favorited":""}" data-id="${r.id}">
              <i class="fa-${a?"solid":"regular"} fa-bookmark"></i>
            </button>
            <a href="#" class="view-details-btn" data-id="${r.id}">
              View Details
            </a>
          </div>
        </div>
      `,t.appendChild(i),i.querySelector(".view-details-btn").addEventListener("click",n=>{n.preventDefault(),window.selectedStoryId=r.id,window.location.href="#/detail"}),i.querySelector(".favorite-btn").addEventListener("click",async n=>{n.preventDefault();try{const s=await m.isFavorite(r.id),l=i.querySelector(".favorite-btn i");s?(await m.removeFromFavorites(r.id),i.querySelector(".favorite-btn").classList.remove("favorited"),l.classList.replace("fa-solid","fa-regular")):(await m.addToFavorites(r),i.querySelector(".favorite-btn").classList.add("favorited"),l.classList.replace("fa-regular","fa-solid")),this._showFavorites&&this._refreshContent()}catch(s){console.error("Error toggling favorite:",s)}})}}}showError(e){this.hideLoading();const t=document.getElementById("error-container");t&&(t.classList.remove("hidden"),t.innerHTML=`
      <div class="error-content">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>Gagal memuat cerita</h3>
        <p>${e}</p>
        <button id="retry-button" class="btn">Coba Lagi</button>
      </div>
    `,document.getElementById("retry-button").addEventListener("click",async()=>{await this._presenter.getStories()}))}_truncateText(e,t){return e.length<=t?e:`${e.substr(0,t)}...`}_formatDate(e){const t={year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"};return new Date(e).toLocaleDateString("id-ID",t)}}class T{constructor(e,t){this._config=e,this._view=t}async addStory(e,t,r,o){try{if(this._view.clearAlert(),this._view.showLoading(),!e)throw new Error("Deskripsi cerita wajib diisi");if(!t)throw new Error("Foto wajib diambil");console.log("Adding story with",r&&o?"location":"no location");const a=await this._config.addStory(e,t,r,o);console.log("Story added successfully"),this._view.showAlert("Cerita berhasil dibagikan!","success"),setTimeout(()=>{window.location.href="#/"},1500)}catch(a){console.error("Add story presenter error:",a),this._view.hideLoading(),this._view.showAlert(a.message)}}}class C{constructor(){this._config=new v,this._presenter=null,this._map=null,this._marker=null,this._cameraStream=null,this._photoBlob=null,this._selectedLocation=null,this._photoSource=null,this._hashChangeHandler=null}async render(){return console.log("Rendering add story page"),`
      <section class="add-story-page page-transition">
        <div class="coordinator-layout">
          <div class="coordinator-header">
            <div>
              <h2 class="coordinator-title">Tambah Cerita Baru</h2>
              <p>Bagikan pengalaman dan cerita menarikmu dengan komunitas</p>
            </div>
          </div>
          
          <div class="form-container">
            <div id="alert-container"></div>
            
            <form id="add-story-form">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-camera"></i> Foto Cerita
                </label>
                <div class="camera-container">
                  <div class="camera-preview">
                    <video id="camera-stream" autoplay playsinline></video>
                    <canvas id="photo-canvas" class="hidden"></canvas>
                    <img id="photo-preview" class="hidden" alt="Preview foto yang diambil">
                  </div>
                  <div class="camera-buttons">
                    <button type="button" id="start-camera" class="btn">
                      <i class="fas fa-camera"></i> Mulai Kamera
                    </button>
                    <button type="button" id="upload-photo" class="btn">
                      <i class="fas fa-upload"></i> Upload Foto
                    </button>
                    <input type="file" id="photo-upload" accept="image/*" class="hidden">
                    <button type="button" id="capture-photo" class="btn hidden" disabled>
                      <i class="fas fa-camera-retro"></i> Ambil Foto
                    </button>
                    <button type="button" id="retake-photo" class="btn hidden">
                      <i class="fas fa-redo"></i> Ambil Ulang
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label for="description" class="form-label">
                  <i class="fas fa-pen"></i> Deskripsi Cerita
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  class="form-textarea" 
                  required
                  placeholder="Ceritakan pengalamanmu..."
                ></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-map-marker-alt"></i> Lokasi
                </label>
                <p class="form-help">Klik pada peta untuk menandai lokasi ceritamu</p>
                <div id="storyMap" class="map-container"></div>
                <div id="location-info" class="location-info hidden">
                  <div>
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Koordinat: <span id="location-text"></span></span>
                  </div>
                  <button type="button" id="clear-location" class="btn btn-sm btn-danger">
                    <i class="fas fa-times"></i> Hapus Lokasi
                  </button>
                </div>
              </div>
              
              <div class="form-actions">
                <a href="#/" class="btn btn-secondary">Batal</a>
                <button type="submit" class="btn btn-success">
                  <i class="fas fa-paper-plane"></i> Bagikan Cerita
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `}async afterRender(){console.log("Add story page afterRender"),this._presenter=new T(this._config,this),setTimeout(()=>{this._initMap()},100),this._initCameraButtons(),this._initFormSubmission(),this._setupHashChangeListener()}_setupHashChangeListener(){this._hashChangeHandler=()=>{console.log("Hash changed, stopping camera if active"),this._stopCameraStream()},window.addEventListener("hashchange",this._hashChangeHandler),console.log("HashChange listener added for camera cleanup")}_initMap(){try{console.log("Initializing add story map"),this._map=L.map("storyMap").setView([-2.5489,118.0149],5);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",maxZoom:19}),r=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',maxZoom:17}),o={OpenStreetMap:e,Satelit:t,Topografi:r};L.control.layers(o).addTo(this._map),e.addTo(this._map),this._map.on("click",a=>{this._handleMapClick(a.latlng)}),this._map.locate({setView:!0,maxZoom:16}),this._map.on("locationfound",a=>{this._map.setView(a.latlng,16)}),setTimeout(()=>{this._map.invalidateSize()},100)}catch(e){console.error("Error initializing map:",e)}}_handleMapClick(e){this._marker&&this._map.removeLayer(this._marker),this._marker=L.marker(e).addTo(this._map),this._marker.bindPopup("Lokasi cerita Anda").openPopup(),this._selectedLocation={lat:e.lat,lon:e.lng};const t=document.getElementById("location-info"),r=document.getElementById("location-text");if(t&&r){t.classList.remove("hidden"),r.textContent=`${e.lat.toFixed(6)}, ${e.lng.toFixed(6)}`;const o=document.getElementById("clear-location");o&&o.addEventListener("click",()=>{this._clearLocation()})}}_clearLocation(){this._marker&&(this._map.removeLayer(this._marker),this._marker=null),this._selectedLocation=null;const e=document.getElementById("location-info");e&&e.classList.add("hidden")}_initCameraButtons(){const e=document.getElementById("start-camera"),t=document.getElementById("capture-photo"),r=document.getElementById("retake-photo"),o=document.getElementById("upload-photo"),a=document.getElementById("photo-upload");if(!e||!t||!r||!o||!a){console.error("Camera buttons not found");return}e.addEventListener("click",()=>{this._startCamera()}),t.addEventListener("click",()=>{this._capturePhoto()}),r.addEventListener("click",()=>{this._retakePhoto()}),o.addEventListener("click",()=>{a.click()}),a.addEventListener("change",i=>{this._handlePhotoUpload(i)})}_handlePhotoUpload(e){const t=e.target.files[0];if(!t)return;if(!t.type.startsWith("image/")){this.showAlert("Silakan pilih file gambar");return}this._photoSource="upload";const r=new FileReader;r.onload=o=>{const a=document.getElementById("photo-preview");a&&(a.src=o.target.result,a.classList.remove("hidden"));const i=document.getElementById("camera-stream");i&&i.classList.add("hidden"),this._stopCameraStream(),fetch(o.target.result).then(u=>u.blob()).then(u=>{this._photoBlob=u});const n=document.getElementById("start-camera"),s=document.getElementById("upload-photo"),l=document.getElementById("capture-photo"),d=document.getElementById("retake-photo");n&&n.classList.add("hidden"),s&&s.classList.add("hidden"),l&&(l.classList.add("hidden"),l.disabled=!0),d&&(d.classList.remove("hidden"),d.innerHTML='<i class="fas fa-redo"></i> Upload Ulang')},r.readAsDataURL(t)}async _startCamera(){try{console.log("Starting camera"),this._cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1});const e=document.getElementById("camera-stream");if(!e)throw new Error("Video element not found");e.srcObject=this._cameraStream,e.classList.remove("hidden");const t=document.getElementById("photo-preview");t&&t.classList.add("hidden");const r=document.getElementById("capture-photo");r&&(r.disabled=!1,r.classList.remove("hidden"));const o=document.getElementById("start-camera"),a=document.getElementById("upload-photo");o&&o.classList.add("hidden"),a&&a.classList.add("hidden");const i=document.getElementById("retake-photo");i&&i.classList.add("hidden")}catch(e){console.error("Camera access error:",e),this.showAlert("Tidak dapat mengakses kamera: "+e.message)}}_capturePhoto(){try{console.log("Capturing photo");const e=document.getElementById("camera-stream"),t=document.getElementById("photo-canvas"),r=document.getElementById("photo-preview");if(!e||!t||!r)throw new Error("Required elements not found");t.width=e.videoWidth,t.height=e.videoHeight,t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toBlob(a=>{this._photoBlob=a,this._photoSource="camera";const i=URL.createObjectURL(a);r.src=i,r.classList.remove("hidden"),e.classList.add("hidden"),this._stopCameraStream();const n=document.getElementById("retake-photo"),s=document.getElementById("capture-photo"),l=document.getElementById("start-camera"),d=document.getElementById("upload-photo");n&&(n.classList.remove("hidden"),n.innerHTML='<i class="fas fa-redo"></i> Ambil Ulang'),s&&(s.classList.add("hidden"),s.disabled=!0),l&&l.classList.add("hidden"),d&&d.classList.add("hidden")},"image/jpeg",.8)}catch(e){console.error("Error capturing photo:",e),this.showAlert("Error capturing photo: "+e.message)}}_retakePhoto(){console.log("Retaking photo"),this._photoBlob=null,this._photoSource=null;const e=document.getElementById("start-camera"),t=document.getElementById("upload-photo");e&&e.classList.remove("hidden"),t&&t.classList.remove("hidden");const r=document.getElementById("retake-photo");r&&r.classList.add("hidden");const o=document.getElementById("photo-preview");o&&o.classList.add("hidden");const a=document.getElementById("capture-photo");a&&(a.classList.add("hidden"),a.disabled=!0);const i=document.getElementById("camera-stream");i&&i.classList.add("hidden");const n=document.getElementById("photo-upload");n&&(n.value="")}_stopCameraStream(){this._cameraStream&&(this._cameraStream.getTracks().forEach(t=>t.stop()),this._cameraStream=null,console.log("Camera stream stopped"))}_initFormSubmission(){const e=document.getElementById("add-story-form");if(!e){console.error("Add story form not found");return}e.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("description").value;if(!this._photoBlob){this.showAlert("Silakan ambil foto terlebih dahulu");return}if(!r){this.showAlert("Silakan masukkan deskripsi cerita");return}const o=this._selectedLocation?this._selectedLocation.lat:null,a=this._selectedLocation?this._selectedLocation.lon:null;await this._presenter.addStory(r,this._photoBlob,o,a)})}showLoading(){const e=document.querySelector('#add-story-form button[type="submit"]');e&&(e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Mengirim...',e.disabled=!0)}hideLoading(){const e=document.querySelector('#add-story-form button[type="submit"]');e&&(e.innerHTML='<i class="fas fa-paper-plane"></i> Bagikan Cerita',e.disabled=!1)}showAlert(e,t="danger"){const r=document.getElementById("alert-container");if(!r){console.error("Alert container not found");return}r.innerHTML=`
      <div class="alert alert-${t}">
        <i class="fas fa-${t==="danger"?"exclamation-triangle":"check-circle"}"></i>
        ${e}
      </div>
    `,r.scrollIntoView({behavior:"smooth"})}clearAlert(){const e=document.getElementById("alert-container");e&&(e.innerHTML="")}beforeUnload(){console.log("AddStoryPage beforeUnload called"),this._stopCameraStream(),this._hashChangeHandler&&(window.removeEventListener("hashchange",this._hashChangeHandler),this._hashChangeHandler=null,console.log("HashChange listener removed")),this._map&&(this._map.remove(),this._map=null)}}class P{constructor(e,t){this._config=e,this._view=t}async getStoriesWithLocation(){try{this._view.showLoading();const t=(await this._config.getStories(1,100,1)).filter(r=>r.lat&&r.lon);console.log("Stories with location:",t.length),this._view.renderStoriesOnMap(t)}catch(e){console.error("Map presenter error:",e),this._view.showError(e.message)}}}class A{constructor(){this._config=new v,this._presenter=null,this._map=null,this._markers=[],this._markerCluster=null}async render(){return console.log("Rendering map page"),`
      <section class="map-page page-transition">
        <div class="coordinator-layout">
          <div class="coordinator-header">
            <div>
              <h2 class="coordinator-title">Peta Cerita</h2>
              <p>Jelajahi cerita berdasarkan lokasi di seluruh dunia</p>
            </div>
            <div class="map-controls">
              <div class="map-info">
                <span class="map-stats">
                  <i class="fas fa-map-marker-alt"></i> <span id="stories-count">0</span> Cerita dengan Lokasi
                </span>
              </div>
            </div>
          </div>
          
          <div class="map-container-wrapper">
            <div id="stories-map-container" class="stories-map-container">
              <!-- Map will be rendered here -->
            </div>
            <div id="map-loading-overlay" class="map-loading-overlay">
              <div class="loader"></div>
            </div>
          </div>
          
          <div id="error-container" class="error-container hidden"></div>
        </div>
      </section>
    `}async afterRender(){console.log("Map page afterRender"),this._presenter=new P(this._config,this),setTimeout(()=>{this._initMap(),this._presenter.getStoriesWithLocation()},100)}_initMap(){try{console.log("Initializing stories map"),this._map=L.map("stories-map-container").setView([-2.5489,118.0149],5);const e=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}),t=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",maxZoom:19}),r=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',maxZoom:17}),o=L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',subdomains:"abcd",maxZoom:19}),a=L.tileLayer("https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}",{attribution:'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',subdomains:"abcd",minZoom:0,maxZoom:18,ext:"png"}),i={OpenStreetMap:e,"CartoDB Light":o,"Stamen Terrain":a,Satelit:t,Topografi:r};L.control.layers(i).addTo(this._map),L.control.scale().addTo(this._map),e.addTo(this._map),this._map.locate({setView:!0,maxZoom:6}),this._markerCluster=L.markerClusterGroup({showCoverageOnHover:!1,maxClusterRadius:50,iconCreateFunction:function(n){const s=n.getChildCount();let l="small";return s>10&&(l="medium"),s>25&&(l="large"),L.divIcon({html:`<div class="cluster-icon"><span>${s}</span></div>`,className:`marker-cluster marker-cluster-${l}`,iconSize:L.point(40,40)})}}),this._map.addLayer(this._markerCluster),setTimeout(()=>{this._map.invalidateSize()},100)}catch(e){console.error("Error initializing map:",e)}}showLoading(){const e=document.getElementById("map-loading-overlay");e&&e.classList.add("active");const t=document.getElementById("error-container");t&&t.classList.add("hidden")}hideLoading(){const e=document.getElementById("map-loading-overlay");e&&e.classList.remove("active")}renderStoriesOnMap(e){if(console.log("Rendering stories on map:",e.length),this.hideLoading(),this._clearMarkers(),e.length===0){this.showError("Tidak ada cerita dengan lokasi yang tersedia");return}const t=document.getElementById("stories-count");t&&(t.textContent=e.length),e.forEach(r=>{if(r.lat&&r.lon)try{const o=L.marker([r.lat,r.lon],{icon:L.divIcon({html:'<div class="custom-marker"><i class="fas fa-map-marker-alt"></i></div>',className:"custom-marker-container",iconSize:[30,42],iconAnchor:[15,42]})}),a=`
            <div class="map-popup">
              <img src="${r.photoUrl}" alt="${r.name}" width="100%">
              <h3>${r.name}</h3>
              <p>${this._truncateText(r.description,100)}</p>
              <button class="btn view-details-btn" data-id="${r.id}">
                <i class="fas fa-eye"></i> View Details
              </button>
            </div>
          `;o.bindPopup(a,{maxWidth:300,minWidth:200,className:"custom-popup"}),this._markerCluster.addLayer(o),this._markers.push(o),o.on("popupopen",()=>{const i=document.querySelector(`.view-details-btn[data-id="${r.id}"]`);i&&i.addEventListener("click",()=>{window.selectedStoryId=r.id,window.location.href="#/detail"})})}catch(o){console.error("Error adding marker for story:",r.id,o)}}),this._markers.length>0&&this._markerCluster.getLayers().length>0&&this._map.fitBounds(this._markerCluster.getBounds().pad(.1))}_clearMarkers(){this._markerCluster&&this._markerCluster.clearLayers(),this._markers=[]}showError(e){this.hideLoading();const t=document.getElementById("error-container");if(!t){console.error("Error container not found");return}t.classList.remove("hidden"),t.innerHTML=`
      <div class="error-content">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>Tidak ada cerita dengan lokasi</h3>
        <p>${e}</p>
        <button id="retry-button" class="btn">
          <i class="fas fa-sync-alt"></i> Coba Lagi
        </button>
      </div>
    `;const r=document.getElementById("retry-button");r&&r.addEventListener("click",async()=>{await this._presenter.getStoriesWithLocation()})}_truncateText(e,t){return e.length<=t?e:e.substr(0,t)+"..."}beforeUnload(){this._map&&(this._map.remove(),this._map=null)}}class D{constructor(e,t){this._config=e,this._view=t}async getStoryDetail(e){try{this._view.showLoading();const t=await this._config.getStoryDetail(e);this._view.renderStoryDetail(t)}catch(t){console.error("Detail presenter error:",t),this._view.showError(t.message)}}}class O{constructor(){this._config=new v,this._presenter=null,this._map=null}async render(){return console.log("Rendering detail page"),`
      <section class="detail-page page-transition">
        <div id="story-detail-container" class="story-detail">
          <div class="loader" id="detail-loader"></div>
        </div>
        <div id="error-container" class="error-container hidden"></div>
      </section>
    `}async afterRender(){console.log("Detail page afterRender");const e=window.selectedStoryId;if(!e){this.showError("ID cerita tidak ditemukan");return}this._presenter=new D(this._config,this),await this._presenter.getStoryDetail(e)}showLoading(){const e=document.getElementById("detail-loader");e&&e.classList.remove("hidden");const t=document.getElementById("error-container");t&&t.classList.add("hidden")}hideLoading(){const e=document.getElementById("detail-loader");e&&e.classList.add("hidden")}renderStoryDetail(e){console.log("Rendering story detail:",e.id),this.hideLoading();const t=document.getElementById("story-detail-container");if(!t){console.error("Detail container not found");return}const r=e.name.charAt(0).toUpperCase();t.innerHTML=`
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">${e.name}'s Story</div>
          <button class="modal-close">&times;</button>
        </div>
        
        <img 
          src="${e.photoUrl}" 
          alt="Cerita dari ${e.name}" 
          class="story-detail-image"
        />
        
        <div class="story-detail-content">
          <div class="user-info">
            <div class="user-avatar">${r}</div>
            <span class="user-name">${e.name}</span>
          </div>
          
          <div class="story-meta">
            <div class="story-info">
              <i class="fas fa-calendar-alt"></i>
              <span>${this._formatDate(e.createdAt)}</span>
            </div>
            
            ${e.lat&&e.lon?`<div class="story-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>Koordinat: ${e.lat.toFixed(6)}, ${e.lon.toFixed(6)}</span>
              </div>`:`<div class="story-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>Tidak ada informasi lokasi</span>
              </div>`}
          </div>
          
          <div class="story-description-full">
            <h3>Cerita</h3>
            <p>${e.description}</p>
          </div>
          
          ${e.lat&&e.lon?`<div class="story-location">
              <h3>Lokasi</h3>
              <div class="story-location-map" id="detail-map"></div>
            </div>`:""}
        </div>
        
        <div class="modal-footer">
          <a href="#/" class="btn btn-secondary">Kembali ke Beranda</a>
        </div>
      </div>
    `;const o=t.querySelector(".modal-close");o&&o.addEventListener("click",()=>{window.location.href="#/"}),e.lat&&e.lon&&setTimeout(()=>{this._initMap(e)},100)}_initMap(e){try{console.log("Initializing map for location:",e.lat,e.lon),this._map=L.map("detail-map").setView([e.lat,e.lon],13);const t=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}),r=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",maxZoom:19}),o=L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",{attribution:'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',maxZoom:17}),a={OpenStreetMap:t,Satelit:r,Topografi:o};L.control.layers(a).addTo(this._map),t.addTo(this._map),L.marker([e.lat,e.lon]).addTo(this._map).bindPopup(`<b>${e.name}'s Story</b><br>${this._truncateText(e.description,100)}`).openPopup(),setTimeout(()=>{this._map.invalidateSize()},100)}catch(t){console.error("Error initializing map:",t)}}showError(e){this.hideLoading();const t=document.getElementById("error-container");if(!t){console.error("Error container not found");return}t.classList.remove("hidden"),t.innerHTML=`
      <div class="error-content">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>Story not found</h3>
        <p>${e}</p>
        <a href="#/" class="btn">Kembali ke Beranda</a>
      </div>
    `}_formatDate(e){const t={year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"};return new Date(e).toLocaleDateString("id-ID",t)}_truncateText(e,t){return e.length<=t?e:e.substr(0,t)+"..."}beforeUnload(){this._map&&(this._map.remove(),this._map=null)}}class y{constructor(){this._baseUrl="https://story-api.dicoding.dev/v1"}async login(e,t){try{console.log("Trying to login with:",e);const o=await(await fetch(`${this._baseUrl}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})})).json();if(o.error)throw new Error(o.message);return console.log("Login successful:",o),o.loginResult}catch(r){throw console.error("Login error:",r),new Error(r.message||"Gagal melakukan login")}}async register(e,t,r){try{console.log("Registering new user:",t);const a=await(await fetch(`${this._baseUrl}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,password:r})})).json();if(a.error)throw new Error(a.message);return console.log("Registration successful"),a}catch(o){throw console.error("Registration error:",o),new Error(o.message||"Gagal melakukan registrasi")}}async subscribeNotification(e){try{const t=localStorage.getItem("token");if(!t)throw new Error("Anda belum login");const o=await(await fetch(`${this._baseUrl}/notifications/subscribe`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(e)})).json();if(o.error)throw new Error(o.message);return o}catch(t){throw console.error("Notification subscription error:",t),new Error(t.message||"Gagal berlangganan notifikasi")}}async unsubscribeNotification(e){try{const t=localStorage.getItem("token");if(!t)throw new Error("Anda belum login");const o=await(await fetch(`${this._baseUrl}/notifications/subscribe`,{method:"DELETE",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({endpoint:e})})).json();if(o.error)throw new Error(o.message);return o}catch(t){throw console.error("Unsubscribe error:",t),new Error(t.message||"Gagal berhenti berlangganan notifikasi")}}}const R=Object.freeze(Object.defineProperty({__proto__:null,AuthConfig:y},Symbol.toStringTag,{value:"Module"}));class M{constructor(e,t){this._config=e,this._view=t}async login(e,t){try{if(this._view.clearAlert(),this._view.showLoading(),!e||!t)throw new Error("Email dan password harus diisi");if(t.length<8)throw new Error("Password minimal 8 karakter");console.log("Login validation passed, calling API");const r=await this._config.login(e,t);console.log("Login successful, saving user data"),h.setUserData(r),console.log("Redirecting to home page"),window.location.href="#/",window.location.reload()}catch(r){console.error("Login presenter error:",r),this._view.hideLoading(),this._view.showAlert(r.message)}}}class x{constructor(){this._config=new y,this._presenter=null}async render(){return console.log("Rendering login page"),`
      <section class="login-page page-transition">
        <div class="form-container">
          <h2 class="form-title">Login</h2>
          
          <div id="alert-container"></div>
          
          <form id="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                required
                placeholder="Masukkan email Anda"
              >
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                class="form-input" 
                required
                placeholder="Masukkan password"
                minlength="8"
              >
            </div>
            
            <button type="submit" class="btn btn-block">
              <i class="fas fa-sign-in-alt"></i> Login
            </button>
          </form>
          
          <div class="form-footer">
            <p>Belum memiliki akun? <a href="#/register">Daftar Sekarang</a></p>
          </div>
        </div>
      </section>
    `}async afterRender(){console.log("Login page afterRender"),this._presenter=new M(this._config,this);const e=document.getElementById("login-form");if(!e){console.error("Login form not found in DOM");return}e.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("email").value,o=document.getElementById("password").value;await this._presenter.login(r,o)})}showLoading(){const e=document.querySelector('#login-form button[type="submit"]');e&&(e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...',e.disabled=!0)}hideLoading(){const e=document.querySelector('#login-form button[type="submit"]');e&&(e.innerHTML='<i class="fas fa-sign-in-alt"></i> Login',e.disabled=!1)}showAlert(e,t="danger"){const r=document.getElementById("alert-container");r&&(r.innerHTML=`
        <div class="alert alert-${t}">
          ${e}
        </div>
      `,r.scrollIntoView({behavior:"smooth"}))}clearAlert(){const e=document.getElementById("alert-container");e&&(e.innerHTML="")}}class ${constructor(e,t){this._config=e,this._view=t}async register(e,t,r,o){try{if(this._view.clearAlert(),this._view.showLoading(),!e||!t||!r||!o)throw new Error("Semua field harus diisi");if(r.length<8)throw new Error("Password minimal 8 karakter");if(r!==o)throw new Error("Password dan konfirmasi password tidak cocok");console.log("Register validation passed, calling API"),await this._config.register(e,t,r),console.log("Registration successful"),this._view.showAlert("Registrasi berhasil. Silakan login.","success"),setTimeout(()=>{window.location.href="#/login"},2e3)}catch(a){console.error("Register presenter error:",a),this._view.hideLoading(),this._view.showAlert(a.message)}}}class U{constructor(){this._config=new y,this._presenter=null}async render(){return console.log("Rendering register page"),`
      <section class="register-page page-transition">
        <div class="form-container">
          <h2 class="form-title">Daftar Akun Baru</h2>
          
          <div id="alert-container"></div>
          
          <form id="register-form">
            <div class="form-group">
              <label for="name" class="form-label">Nama</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                class="form-input" 
                required
                placeholder="Masukkan nama Anda"
              >
            </div>
            
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                class="form-input" 
                required
                placeholder="Masukkan email Anda"
              >
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                class="form-input" 
                required
                placeholder="Masukkan password"
                minlength="8"
              >
              <small>Password minimal 8 karakter</small>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword" class="form-label">Konfirmasi Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                class="form-input" 
                required
                placeholder="Konfirmasi password Anda"
                minlength="8"
              >
            </div>
            
            <button type="submit" class="btn btn-block">
              <i class="fas fa-user-plus"></i> Daftar
            </button>
          </form>
          
          <div class="form-footer">
            <p>Sudah memiliki akun? <a href="#/login">Login Sekarang</a></p>
          </div>
        </div>
      </section>
    `}async afterRender(){console.log("Register page afterRender"),this._presenter=new $(this._config,this);const e=document.getElementById("register-form");if(!e){console.error("Register form not found in DOM");return}e.addEventListener("submit",async t=>{t.preventDefault();const r=document.getElementById("name").value,o=document.getElementById("email").value,a=document.getElementById("password").value,i=document.getElementById("confirmPassword").value;await this._presenter.register(r,o,a,i)})}showLoading(){const e=document.querySelector('#register-form button[type="submit"]');e&&(e.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...',e.disabled=!0)}hideLoading(){const e=document.querySelector('#register-form button[type="submit"]');e&&(e.innerHTML='<i class="fas fa-user-plus"></i> Daftar',e.disabled=!1)}showAlert(e,t="danger"){const r=document.getElementById("alert-container");r&&(r.innerHTML=`
        <div class="alert alert-${t}">
          ${e}
        </div>
      `,r.scrollIntoView({behavior:"smooth"}))}clearAlert(){const e=document.getElementById("alert-container");e&&(e.innerHTML="")}}class F{constructor(){this._title="halaman tidak ditemukan - StoryApps"}async render(){return document.title=this._title,`
      <section class="not-found-page page-transition">
        <div class="not-found-container">
          <div class="not-found-content">
            <h1>404</h1>
            <h2>Halaman Tidak Ditemukan</h2>
            <p>Maaf, halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.</p>
            <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
          </div>
        </div>
      </section>
    `}async afterRender(){const e=document.querySelector(".not-found-content");e&&e.classList.add("animate-fade-in")}}class N{constructor(){this._title="StoryApps"}async render(){return document.title=this._title,`
      <section class="favorites-page page-transition">
        <div class="coordinator-layout">
          <div class="coordinator-header">
            <div>
              <h2 class="coordinator-title">Cerita Favorit</h2>
              <p>Kumpulan cerita yang Anda tandai sebagai favorit</p>
            </div>
            <a href="#/" class="btn btn-secondary">
              <i class="fas fa-arrow-left"></i> Kembali ke Beranda
            </a>
          </div>
          
          <div id="favorites-container" class="coordinator-grid">
            <div class="loader" id="favorites-loader"></div>
          </div>
          
          <div id="error-container" class="error-container hidden"></div>
        </div>
      </section>
    `}async afterRender(){if(!h.isLoggedIn()){window.location.href="#/login";return}this.showLoading();try{const e=await m.getFavorites();this.renderFavorites(e)}catch(e){console.error("Error loading favorites:",e),this.showError("Gagal memuat cerita favorit: "+e.message)}}showLoading(){const e=document.getElementById("favorites-loader");e&&e.classList.remove("hidden");const t=document.getElementById("error-container");t&&t.classList.add("hidden")}hideLoading(){const e=document.getElementById("favorites-loader");e&&e.classList.add("hidden")}async renderFavorites(e){this.hideLoading();const t=document.getElementById("favorites-container");if(!t){console.error("Favorites container not found");return}if(!e||e.length===0){t.innerHTML=`
        <div class="empty-state">
          <p>Belum ada cerita favorit.</p>
          <a href="#/" class="btn btn-primary">Jelajahi Cerita</a>
        </div>
      `;return}t.innerHTML="",e.forEach(r=>{const o=r.name.charAt(0).toUpperCase(),a=document.createElement("article");a.classList.add("story-card"),a.innerHTML=`
        <div class="story-image-container">
          <img
            src="${r.photoUrl}"
            alt="Cerita dari ${r.name}"
            class="story-image"
            loading="lazy"
            onerror="this.src='./src/public/fallback.jpg';"
          />
        </div>
        <div class="story-content">
          <div class="user-info">
            <div class="user-avatar">${o}</div>
            <span class="user-name">${r.name}</span>
          </div>
          
          <h3 class="story-title">${r.name}</h3>
          <p class="story-description">${this._truncateText(r.description,100)}</p>
          
          <div class="story-meta">
            <div class="story-info">
              <i class="fas fa-calendar-alt"></i>
              <span>${this._formatDate(r.createdAt)}</span>
            </div>
            
            ${r.lat&&r.lon?`<div class="story-info">
                <i class="fas fa-map-marker-alt"></i>
                <span>Lokasi tersedia</span>
              </div>`:""}
          </div>
          
          <div class="story-actions">
            <button class="favorite-btn favorited" data-id="${r.id}">
              <i class="fas fa-bookmark"></i>
            </button>
            <a href="#" class="view-details-btn" data-id="${r.id}">
              View Details
            </a>
          </div>
        </div>
      `,t.appendChild(a),a.querySelector(".view-details-btn").addEventListener("click",s=>{s.preventDefault(),window.selectedStoryId=r.id,window.location.href="#/detail"}),a.querySelector(".favorite-btn").addEventListener("click",async s=>{s.preventDefault();try{await m.removeFromFavorites(r.id),a.remove(),(await m.getFavorites()).length===0&&this.renderFavorites([]),"Notification"in window&&Notification.permission==="granted"&&navigator.serviceWorker.ready.then(d=>{d.showNotification("StoryApps",{body:"Cerita berhasil dihapus dari favorit",icon:"./src/public/icons/icon-192x192.png",badge:"./src/public/icons/badge-96x96.png",vibrate:[100,50,100]})})}catch(l){console.error("Error removing from favorites:",l)}})})}showError(e){this.hideLoading();const t=document.getElementById("error-container");if(!t){console.error("Error container not found");return}t.classList.remove("hidden"),t.innerHTML=`
      <div class="error-content">
        <i class="fas fa-exclamation-triangle fa-3x"></i>
        <h3>Gagal memuat cerita favorit</h3>
        <p>${e}</p>
        <button id="retry-button" class="btn">Coba Lagi</button>
      </div>
    `;const r=document.getElementById("retry-button");r&&r.addEventListener("click",async()=>{this.showLoading();try{const o=await m.getFavorites();this.renderFavorites(o)}catch(o){console.error("Error reloading favorites:",o),this.showError("Gagal memuat cerita favorit: "+o.message)}})}_truncateText(e,t){return e?e.length<=t?e:e.substr(0,t)+"...":""}_formatDate(e){if(!e)return"-";const t={year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"};return new Date(e).toLocaleDateString("id-ID",t)}}const w={"/":{view:I},"/add":{view:C},"/map":{view:A},"/detail":{view:O},"/login":{view:x},"/register":{view:U},"/favorites":{view:N},"/404":{view:F}};class G{static parseActiveUrlWithCombiner(){const e=window.location.hash.slice(1).toLowerCase();return this._urlCombiner(this._urlSplitter(e))}static parseActiveUrlWithoutCombiner(){const e=window.location.hash.slice(1).toLowerCase();return this._urlSplitter(e)}static _urlSplitter(e){const t=e.split("/");return{resource:t[1]||null,id:t[2]||null,verb:t[3]||null}}static _urlCombiner(e){return e.resource?`/${e.resource}`:"/"}}const H="modulepreload",q=function(c){return"/"+c},b={},z=function(e,t,r){let o=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),n=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));o=Promise.allSettled(t.map(s=>{if(s=q(s),s in b)return;b[s]=!0;const l=s.endsWith(".css"),d=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${d}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":H,l||(u.as="script"),u.crossOrigin="",u.href=s,n&&u.setAttribute("nonce",n),document.head.appendChild(u),l)return new Promise((_,E)=>{u.addEventListener("load",_),u.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${s}`)))})}))}function a(i){const n=new Event("vite:preloadError",{cancelable:!0});if(n.payload=i,window.dispatchEvent(n),!n.defaultPrevented)throw i}return o.then(i=>{for(const n of i||[])n.status==="rejected"&&a(n.reason);return e().catch(a)})};class f{static async registerServiceWorker(){if(!("serviceWorker"in navigator))return console.log("Service Worker tidak didukung di browser ini"),null;try{const e=await navigator.serviceWorker.register("./sw.js",{scope:"./"});return console.log("Service Worker berhasil didaftarkan",e),e}catch(e){return console.error("Registrasi Service Worker gagal:",e),null}}static async requestPermission(){if(!("Notification"in window))return console.log("Browser tidak mendukung notifikasi"),!1;const e=await Notification.requestPermission();return e==="denied"?(console.log("Fitur notifikasi tidak diizinkan"),!1):e==="default"?(console.log("Pengguna menutup kotak dialog permintaan izin"),!1):!0}static async getVapidPublicKey(){return"BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk"}static async subscribePushNotification(e){if(!e.active){console.error("Service Worker tidak aktif");return}const t=await this.getVapidPublicKey(),r=this._urlBase64ToUint8Array(t);try{const o=await e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:r});return console.log("Berhasil melakukan subscribe dengan endpoint:",o.endpoint),await this._sendSubscriptionToServer(o),o}catch(o){return console.error("Gagal melakukan subscribe:",o),null}}static async _sendSubscriptionToServer(e){try{const{AuthConfig:t}=await z(async()=>{const{AuthConfig:o}=await Promise.resolve().then(()=>R);return{AuthConfig:o}},void 0);await new t().subscribeNotification(e),console.log("Berhasil mengirim subscription ke server")}catch(t){throw console.error("Gagal mengirim subscription ke server:",t),t}}static _urlBase64ToUint8Array(e){const t="=".repeat((4-e.length%4)%4),r=(e+t).replace(/-/g,"+").replace(/_/g,"/"),o=window.atob(r),a=new Uint8Array(o.length);for(let i=0;i<o.length;i++)a[i]=o.charCodeAt(i);return a}static showNotification(e,t){if(!("Notification"in window)){console.log("Browser tidak mendukung notifikasi");return}Notification.permission==="granted"?navigator.serviceWorker.ready.then(r=>{r.showNotification(e,t)}):(console.log("Izin notifikasi tidak diberikan"),alert("Anda belum memberikan izin untuk menerima notifikasi."))}}class j{static init(){this._setupNetworkListeners(),this._createOfflineIndicator()}static _setupNetworkListeners(){window.addEventListener("online",()=>{this._updateOfflineStatus(!1),this._showToast("Anda kembali online")}),window.addEventListener("offline",()=>{this._updateOfflineStatus(!0),this._showToast("Anda sedang offline. Beberapa fitur mungkin terbatas.","warning")}),navigator.onLine||this._updateOfflineStatus(!0)}static _createOfflineIndicator(){if(!document.getElementById("offline-indicator")){const e=document.createElement("div");e.id="offline-indicator",e.className="offline-indicator",e.innerHTML='<i class="fas fa-wifi"></i> Anda sedang offline. Beberapa fitur mungkin terbatas.',document.body.insertBefore(e,document.body.firstChild)}}static _updateOfflineStatus(e){const t=document.getElementById("offline-indicator");t&&(e?t.classList.add("show"):t.classList.remove("show"))}static _showToast(e,t="info"){let r=document.getElementById("toast");r||(r=document.createElement("div"),r.id="toast",r.className="toast",document.body.appendChild(r)),r.textContent=e,r.classList.add("show"),t==="warning"?(r.style.backgroundColor="var(--warning-color)",r.style.color="#333"):(r.style.backgroundColor="var(--primary-color)",r.style.color="#fff"),setTimeout(()=>{r.classList.remove("show")},3e3)}static isOnline(){return navigator.onLine}}class V{static init(){this.deferredPrompt=null,this._setupEventListeners()}static _setupEventListeners(){window.addEventListener("beforeinstallprompt",e=>{e.preventDefault(),this.deferredPrompt=e,this._showInstallBanner()}),document.addEventListener("DOMContentLoaded",()=>{const e=document.getElementById("install-pwa"),t=document.getElementById("close-banner");e&&e.addEventListener("click",function(){window.location.href="https://storyapps.netlify.app"}),t&&t.addEventListener("click",()=>{this._hideInstallBanner()})}),window.addEventListener("appinstalled",()=>{this._hideInstallBanner(),this.deferredPrompt=null,console.log("PWA was installed")})}static _showInstallBanner(){const e=document.getElementById("pwa-install-banner");e&&this.deferredPrompt&&e.classList.add("show")}static _hideInstallBanner(){const e=document.getElementById("pwa-install-banner");e&&e.classList.remove("show")}static async _installPwa(){if(!this.deferredPrompt)return;this.deferredPrompt.prompt();const e=await this.deferredPrompt.userChoice;this.deferredPrompt=null,e.outcome==="accepted"?console.log("User accepted the install prompt"):console.log("User dismissed the install prompt"),this._hideInstallBanner()}}window.selectedStoryId=null;class W{constructor(){this._currentPage=null,this._initializeApp()}async _initializeApp(){console.log("Initializing app..."),await this._initIndexedDB(),await this._initServiceWorker(),j.init(),V.init(),await this._subscribeToPushNotification(),this._initMobileNav(),this._checkAuthStatus(),this._handleRoute(),window.addEventListener("hashchange",()=>{this._cleanupCurrentPage(),this._handleRoute()}),window.addEventListener("beforeunload",()=>{this._cleanupCurrentPage()}),document.addEventListener("click",e=>{e.target.tagName==="A"&&e.target.href.includes("#/")&&document.startViewTransition&&(e.preventDefault(),document.startViewTransition(()=>{window.location.href=e.target.href}))})}async _initServiceWorker(){try{if(console.log("Initializing Service Worker..."),"serviceWorker"in navigator){const e=await navigator.serviceWorker.register("./sw.js",{scope:"./"});return console.log("Service Worker registered successfully:",e),e.addEventListener("updatefound",()=>{console.log("New service worker found, updating...")}),h.isLoggedIn()&&await f.requestPermission()&&e&&await f.subscribePushNotification(e),e}else return console.warn("Service Worker not supported"),null}catch(e){return console.error("Error initializing service worker:",e),null}}async _initIndexedDB(){try{await m.openDB(),console.log("IndexedDB initialized successfully")}catch(e){console.error("Failed to initialize IndexedDB:",e)}}_initMobileNav(){const e=document.getElementById("menu"),t=document.getElementById("drawer");if(!e||!t){console.error("Menu button or drawer not found");return}e.addEventListener("click",o=>{o.stopPropagation(),t.classList.toggle("open")}),document.addEventListener("click",o=>{t.classList.contains("open")&&!t.contains(o.target)&&t.classList.remove("open")}),document.querySelectorAll(".nav-item a").forEach(o=>{o.addEventListener("click",()=>{t.classList.remove("open")})})}_checkAuthStatus(){var s,l,d;console.log("Checking auth status...");const e=h.isLoggedIn(),t=document.getElementById("login-menu"),r=document.getElementById("register-menu"),o=document.getElementById("logout-menu"),a=(s=document.querySelector('.nav-item a[href="#/favorites"]'))==null?void 0:s.parentElement,i=(l=document.querySelector('.nav-item a[href="#/add"]'))==null?void 0:l.parentElement,n=(d=document.querySelector('.nav-item a[href="#/map"]'))==null?void 0:d.parentElement;if(!t||!r||!o){console.error("Menu items not found");return}e?(console.log("User is logged in"),t.classList.add("hidden"),r.classList.add("hidden"),o.classList.remove("hidden"),a&&a.classList.remove("hidden"),i&&i.classList.remove("hidden"),n&&n.classList.remove("hidden"),this._subscribeToPushNotification()):(console.log("User is not logged in"),t.classList.remove("hidden"),r.classList.remove("hidden"),o.classList.add("hidden"),a&&a.classList.add("hidden"),i&&i.classList.add("hidden"),n&&n.classList.add("hidden")),o.addEventListener("click",u=>{u.preventDefault(),this._handleLogout()})}async _subscribeToPushNotification(){try{if("serviceWorker"in navigator){const e=await navigator.serviceWorker.ready;await f.requestPermission()&&e&&await f.subscribePushNotification(e)}}catch(e){console.error("Error subscribing to push notification:",e)}}async _handleLogout(){this._cleanupCurrentPage(),h.logout();try{await m.clearStories(),console.log("Stories cleared from IndexedDB after logout")}catch(e){console.error("Error clearing stories from IndexedDB:",e)}window.location.href="#/",window.location.reload()}_cleanupCurrentPage(){this._currentPage&&typeof this._currentPage.beforeUnload=="function"&&(console.log("Cleaning up current page..."),this._currentPage.beforeUnload(),this._currentPage=null)}async _handleRoute(){console.log("Handling route..."),this._cleanupCurrentPage();const e=window.location.hash.slice(1).split("/");e.length>2&&e[1]==="detail"&&(window.selectedStoryId=e[2],window.history.replaceState(null,null,"#/detail"));const t=G.parseActiveUrlWithCombiner();console.log("Current URL:",t);let r;w[t]?r=w[t]:(console.log("Route not found, redirecting to 404 page"),r=w["/404"]),console.log("Page to render:",r);try{if((t==="/login"||t==="/register")&&h.isLoggedIn()){console.log("User is logged in, redirecting to home"),window.location.href="#/";return}if((t==="/add"||t==="/map"||t==="/favorites")&&!h.isLoggedIn()){console.log("Protected route, redirecting to login"),window.location.href="#/login";return}const o=document.querySelector("#content");if(!o){console.error("Content container not found");return}o.innerHTML="",this._currentPage=new r.view,console.log("View instantiated");const a=await this._currentPage.render();console.log("Content rendered"),o.innerHTML=a,console.log("Content injected into DOM"),await this._currentPage.afterRender(),console.log("afterRender completed"),document.getElementById("main-content").focus()}catch(o){console.error("Error rendering page:",o)}}}document.addEventListener("DOMContentLoaded",()=>{console.log("DOM fully loaded"),new W});
