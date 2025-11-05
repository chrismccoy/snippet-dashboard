/**
 * Main JavaScript for the Snippet Dashboard.
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Light/Dark Mode Theme Switcher
   */
  const themeSwitcher = document.getElementById("theme-switcher");
  const themeIconSun = document.getElementById("theme-icon-sun");
  const themeIconMoon = document.getElementById("theme-icon-moon");
  const htmlEl = document.documentElement;

  const applyTheme = (theme) => {
    if (theme === "dark") {
      htmlEl.classList.add("dark");
      themeIconSun.classList.add("hidden");
      themeIconMoon.classList.remove("hidden");
    } else {
      htmlEl.classList.remove("dark");
      themeIconSun.classList.remove("hidden");
      themeIconMoon.classList.add("hidden");
    }
  };

  if (themeSwitcher) {
    const currentTheme = htmlEl.classList.contains("dark") ? "dark" : "light";

    applyTheme(currentTheme);

    themeSwitcher.addEventListener("click", () => {
      const isDark = htmlEl.classList.toggle("dark");
      const newTheme = isDark ? "dark" : "light";
      applyTheme(newTheme);
      document.cookie = `theme=${newTheme}; max-age=31536000; path=/; SameSite=Lax`;
    });
  }

  /**
   * Scroll-to-Top Button
   */
  const scrollToTopBtn = document.getElementById("scroll-to-top-btn");

  if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) {
        scrollToTopBtn.classList.remove("hidden");
      } else {
        scrollToTopBtn.classList.add("hidden");
      }
    });
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /**
   * SEO-Friendly Search Form Handler
   */
  const searchForm = document.getElementById("search-form");

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const searchInput = searchForm.querySelector('input[name="q"]');
      const query = searchInput.value.trim();
      if (query) {
        const encodedQuery = encodeURIComponent(query);
        window.location.href = `/search/${encodedQuery}`;
      }
    });
  }

  /**
   * Print Snippet Button
   */
  const printBtn = document.getElementById("print-btn");

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  /**
   * Copy-to-Clipboard Button (for Snippets)
   */
  const copyCodeBtn = document.getElementById("copy-code-btn");
  const codeContent = document.getElementById("code-content");

  if (copyCodeBtn && codeContent) {
    copyCodeBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(codeContent.textContent)
        .then(() => {
          const originalText = copyCodeBtn.textContent;
          copyCodeBtn.textContent = "Copied!";
          copyCodeBtn.classList.add("bg-yellow-300");
          copyCodeBtn.disabled = true;
          setTimeout(() => {
            copyCodeBtn.textContent = originalText;
            copyCodeBtn.classList.remove("bg-yellow-300");
            copyCodeBtn.disabled = false;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy code to clipboard.", err);
          copyCodeBtn.textContent = "Error!";
        });
    });
  }

  /**
   * Share Shortlink Button
   */
  const shareShortlinkBtn = document.getElementById("share-shortlink-btn");

  if (shareShortlinkBtn) {
    shareShortlinkBtn.addEventListener("click", () => {

      const shortId = shareShortlinkBtn.dataset.shortid;

      if (!shortId) {
        console.error("Short ID not found for sharing.");
        return;
      }
      const shortlink = `${window.location.origin}/${shortId}`;

      navigator.clipboard
        .writeText(shortlink)
        .then(() => {
          const originalText = shareShortlinkBtn.textContent;
          shareShortlinkBtn.textContent = "Copied!";
          shareShortlinkBtn.classList.add("bg-yellow-300");
          shareShortlinkBtn.disabled = true;
          setTimeout(() => {
            shareShortlinkBtn.textContent = originalText;
            shareShortlinkBtn.classList.remove("bg-yellow-300");
            shareShortlinkBtn.disabled = false;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy shortlink to clipboard.", err);
          shareShortlinkBtn.textContent = "Error!";
        });
    });
  }

  /**
   * Copy API Key on Profile Page
   */
  const copyApiKeyBtn = document.getElementById("copy-api-key-btn");
  const apiKeyInput = document.getElementById("api-key-input");

  if (copyApiKeyBtn && apiKeyInput) {
    copyApiKeyBtn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(apiKeyInput.value)
        .then(() => {
          const originalText = copyApiKeyBtn.textContent;
          copyApiKeyBtn.textContent = "Copied!";
          setTimeout(() => {
            copyApiKeyBtn.textContent = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy API key.", err);
        });
    });
  }

  /**
   * API Key Regeneration Confirmation Modal
   */
  const regenerateForm = document.getElementById("regenerate-api-key-form");
  const openRegenerateModalBtn = document.getElementById("open-regenerate-modal");
  const regenerateModal = document.getElementById("regenerate-modal");
  const confirmRegenerateBtn = document.getElementById("confirm-regenerate");
  const cancelRegenerateBtn = document.getElementById("cancel-regenerate");
  const body = document.body;

  if (openRegenerateModalBtn && regenerateModal) {

    openRegenerateModalBtn.addEventListener("click", (event) => {
      event.preventDefault();
      regenerateModal.classList.remove("hidden");
      body.classList.add("overflow-hidden");
    });

    cancelRegenerateBtn.addEventListener("click", () => {
      regenerateModal.classList.add("hidden");
      body.classList.remove("overflow-hidden");
    });

    confirmRegenerateBtn.addEventListener("click", () => {
      regenerateModal.classList.add("hidden");
      body.classList.remove("overflow-hidden");
      regenerateForm.submit();
    });

    regenerateModal.addEventListener('click', (event) => {
        if (event.target === regenerateModal) {
            regenerateModal.classList.add("hidden");
            body.classList.remove("overflow-hidden");
        }
    });
  }

  /**
   * Admin Panel Inline Delete Confirmation
   */
  const deleteContainers = document.querySelectorAll(".delete-container");

  deleteContainers.forEach((container) => {
    const deleteBtn = container.querySelector(".delete-btn");
    const confirmDiv = container.querySelector(".delete-confirm");
    const cancelBtn = container.querySelector(".cancel-delete-btn");

    if (deleteBtn && confirmDiv && cancelBtn) {
      deleteBtn.addEventListener("click", () => {
        deleteBtn.style.display = "none";
        confirmDiv.style.display = "inline-flex";
      });
      cancelBtn.addEventListener("click", () => {
        confirmDiv.style.display = "none";
        deleteBtn.style.display = "inline";
      });
    }
  });

  /**
   * Admin Panel Inline Edit Toggle
   */
  const listItems = document.querySelectorAll(".inline-editable-item");

  listItems.forEach((itemRow) => {
    const displayDivs = itemRow.querySelectorAll(".item-display");
    const editDiv = itemRow.querySelector(".item-edit");
    const editBtn = itemRow.querySelector(".edit-item-btn");
    const cancelEditBtn = itemRow.querySelector(".cancel-edit-btn");

    if (displayDivs.length > 0 && editDiv && editBtn && cancelEditBtn) {
      editBtn.addEventListener("click", () => {
        displayDivs.forEach((div) => (div.style.display = "none"));
        editDiv.style.display = "block";
      });
      cancelEditBtn.addEventListener("click", () => {
        editDiv.style.display = "none";
        displayDivs.forEach((div) => (div.style.display = "flex"));
      });
    }
  });
});
