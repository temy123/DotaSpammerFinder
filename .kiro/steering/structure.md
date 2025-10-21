# Project Structure

The project is organized into distinct directories for frontend assets, backend logic, and data storage. This separation helps in maintaining a clean and scalable codebase.

## Directory Layout

-   **`/` (Root):** Contains the main HTML pages (`index.html`, `about.html`, `service.html`), project configuration (`_config.yml`, `CNAME`), and the `official_heroes.json` data file.
-   **`.kiro/steering/`:** Stores Kiro's steering files (`product.md`, `tech.md`, `structure.md`) to guide the AI assistant.
-   **`css/`:** Holds all compiled CSS files for styling the website. This includes framework files (`bootstrap_minty.min.css`) and custom stylesheets (`main.css`, `service.css`).
-   **`js/`:** Contains JavaScript files responsible for the website's client-side interactivity. `core.js` likely contains shared functions, while others like `search.js` and `service.js` are for specific pages.
-   **`img/`:** Stores all images and graphical assets used in the frontend, including hero icons, rank icons, and logos.
    -   **`img/heroes/`:** A dedicated subdirectory for Dota 2 hero images, named by hero (e.g., `alchemist.png`).
-   **`less/`:** Contains the source `.less` files, which are pre-processed into the final CSS files in the `css/` directory. This allows for more organized and maintainable styling.
-   **`db/`:** Stores the production SQLite database files used by the live application.
-   **`DbMaker/`:** A self-contained Python application responsible for creating, updating, and managing the SQLite databases. It fetches data from an external API, processes it, and generates the `.db` files. It has its own source code (`main.py`), dependencies, and a `Dockerfile` for containerization.

## File Naming Conventions

-   **HTML:** Files are named based on their purpose (e.g., `index.html`, `about.html`).
-   **CSS/LESS:** Stylesheets are named descriptively, corresponding to the page or component they style (e.g., `main.css`, `search.less`).
-   **JavaScript:** Scripts are named based on their functionality (e.g., `core.js`, `search.js`).
-   **Images:** Image files are named to clearly describe their content (e.g., `icon_carry.jpg`, `alchemist.png`).
-   **Database:** Database files are named with a date stamp (e.g., `22-08-12.db`) or a descriptive name (`od.db`), indicating when the data was last updated.

## Architectural Standards

-   **Static Site Architecture:** The frontend is a static website (HTML, CSS, JS) that is likely hosted on GitHub Pages. It fetches or uses data prepared by the backend.
-   **Decoupled Data Generation:** The backend (`DbMaker/`) is a separate, offline process. It runs independently to generate the SQLite database files, which are then used by the frontend.
-   **Modular CSS:** The use of LESS and separate CSS files for different pages/components promotes modularity and easier maintenance.
-   **Containerization:** The backend logic in `DbMaker/` is containerized using Docker, ensuring a consistent environment for data processing tasks.