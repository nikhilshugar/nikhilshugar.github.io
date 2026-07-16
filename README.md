# Nikhil Hugar — Portfolio

Personal portfolio website for Nikhil Shreeshail Hugar.

## Project structure

```text
.
├── assets/
│   ├── Nikhil_Shreeshail_Hugar_Resume.pdf
│   └── profile.png
├── index.html
├── script.js
└── styles.css
```

## Run locally

The site has no build step or third-party dependencies. Open `index.html` directly, or serve the folder with any static web server.

For example, with Python installed:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy with GitHub Pages

1. Create a new public repository on GitHub.
2. Upload all files from this folder so `index.html` is at the repository root.
3. Open the repository's **Settings**.
4. Select **Pages** in the sidebar.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and the `/ (root)` folder, then save.
7. GitHub will publish the site at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

Future pushes to the selected branch will update the live site automatically.

## Update content

- Edit page content in `index.html`.
- Edit presentation and responsive styles in `styles.css`.
- Edit interactions and animation behavior in `script.js`.
- Replace files in `assets/` while retaining their filenames to update the profile photo or résumé without changing markup.
