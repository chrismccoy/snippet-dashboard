# Snippet Dashboard

A minimalist, self-hosted code snippet manager with a sharp, brutalist design. A personal tool that is a **full-fledged multi-user platform with robust API access and comprehensive CLI administration**, it's built for developers who want a fast, straightforward, and private way to store and share their code, notes, and solutions.

## Key Features

-   👥 **Multi-User System:** Secure user accounts with an admin approval workflow and role-based access.
-   🔑 **API Access with Keys:** Programmatically post and **list** snippets using unique API keys per user. Users can regenerate their keys securely.
-   **🛠️ CLI Administration Tool:** A powerful command-line interface for administrators to directly list, delete, and create snippets, bypassing the web UI/API.
-   🔒 **Private Snippets:** Mark snippets as private, making them accessible only via direct URL (shortlink/slug) but hidden from all public listings (homepage, search, archives).
-   ✍️ **Author Archives:** Dedicated public pages showcasing all **public** snippets by a specific author, with author names linking directly to their archives.
-   🔗 **Shareable Shortlinks:** Dedicated "Share Shortlink" button copies a compact, permanent short URL to the clipboard, ideal for sharing, regardless of the primary URL style.
-   🌗 **Light/Dark Mode:** A persistent, flash-free theme switcher for user comfort, available across all pages (public and admin).
-   🏠 **Self-Hosted:** Keep your code snippets on your own server for ultimate privacy and control.
-   📋 **Copy to Clipboard:** A one-click button on every snippet page to instantly copy the code.
-   📥 **Source Code Download:** Download any snippet as a properly named file (e.g., `my-snippet.js`) directly from the view page.
-   🖨️ **Printer-Friendly View:** Print a clean, formatted version of just the source code, with all site navigation and metadata hidden.
-   ⬆️ **Scroll-to-Top Button:** A convenient button appearing on scroll for quick navigation back to the top of longer pages.
-   ✨ **Syntax Highlighting:** Automatic language detection and highlighting for dozens of languages via Prism.js.
-   🔍 **Full-Text Search:** Quickly find snippets by title, description, or code content across **public** snippets.
-   🏷️ **Powerful Organization:** Group snippets by category, language, and multiple tags. The language list in the sidebar intelligently hides empty entries.
-   🌐 **Flexible URL Styles:** Choose between SEO-friendly slugs (`/hello-world`) or permanent short IDs (`/Ua3xZ8fE`) via a simple configuration setting.
-   🔐 **Secure Admin Dashboard:** Password-protected dashboard for comprehensive content and user management.
-   🛡️ **Login Protection:** Built-in rate limiting on the login page to prevent brute-force attacks.
-   📱 **Responsive:** Functional and readable on both desktop and mobile devices.

### Frontend Features

-   **Public View:**
    -   Paginated homepage, search results, and archive pages for Categories, Languages, and **Authors**, all displaying **public snippets only**.
    -   Clean, modern URLs for snippets at the root level (`/my-snippet`).
    -   Permanent redirects for old URL structures to preserve links and SEO.
    -   **Snippet Details Page:** Features "Download," "Print," "Copy Code," and **"Share Shortlink"** buttons. Clearly displays Author and **Privacy Status (if private)**.
    -   **Author Names as Links:** Clickable author names on snippet cards and detail pages lead to their personal archive of **public** snippets.
    -   **Smart Sidebar:** The languages list is dynamically generated, only showing languages that have one or more **public** snippets.
    -   Scroll-to-Top button for improved navigation on long pages.
    -   A global Light/Dark mode switcher is present on all public pages.

-   **Admin Dashboard:**
    -   **User Management:** Dedicated admin pages to approve/revoke users, view all users, and **manually create new, pre-approved user accounts**.
    -   **My Profile Page:** For users to view their details, update their email/password, and securely regenerate their unique API key.
    -   **CRUD for Snippets:** Any logged-in user can create, view, edit, and delete their own snippets (both public and private). Admins have full oversight and can manage all snippets regardless of owner, with an "Author" column and "Visibility" badge to aid management.
    -   **CRUD for Categories & Languages:** Only administrators can manage these global taxonomies.
    -   "View" link on all content to preview the public-facing page in a new tab.
    -   A global Light/Dark mode switcher is present on all admin pages.
    -   Secure session-based authentication with an improved login page and public signup form.
