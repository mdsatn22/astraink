document.addEventListener("DOMContentLoaded", () => {

  const pages = [...document.querySelectorAll("main > .page")];
  const navigation = document.getElementById("navigation");
  const menuToggle = document.getElementById("menuToggle");

  // Show a page and optionally an article
  function navigate(pageId, articleId = null, addHistory = true) {

    const page = document.getElementById(pageId);

    if (!page || !page.classList.contains("page")) {
      console.error("Cannot find page:", pageId);
      return;
    }

    // Hide every page
    pages.forEach(item => {
      item.classList.remove("active");

      item.querySelectorAll(".article-view").forEach(article => {
        article.classList.remove("active");
      });

      const list = item.querySelector(".article-list");

      if (list) {
        list.style.display = "block";
      }
    });

    // Display selected page
    page.classList.add("active");

    // Display selected article if requested
    if (articleId) {

      const article = document.getElementById(articleId);

      if (article && page.contains(article)) {

        const list = page.querySelector(".article-list");

        if (list) {
          list.style.display = "none";
        }

        article.classList.add("active");

      } else {
        console.error("Cannot find article:", articleId);
      }
    }

    // Update navigation highlighting
    document.querySelectorAll(".nav-links [data-page]").forEach(link => {
      link.classList.toggle("active", link.dataset.page === pageId);
    });

    // Close mobile menu
    if (navigation) {
      navigation.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    // Update URL
    if (addHistory) {
      const hash = articleId
        ? `#${pageId}/${articleId}`
        : `#${pageId}`;

      history.pushState(
        { pageId, articleId },
        "",
        hash
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Handle all navigation and article buttons
  document.addEventListener("click", event => {

    const pageLink = event.target.closest("[data-page]");

    if (pageLink) {
      event.preventDefault();
      navigate(pageLink.dataset.page);
      return;
    }

    const openButton = event.target.closest("[data-open]");

    if (openButton) {
      event.preventDefault();

      const article = document.getElementById(openButton.dataset.open);

      if (!article) {
        console.error("Article ID does not exist:", openButton.dataset.open);
        return;
      }

      const parentPage = article.closest(".page");

      if (!parentPage) {
        console.error("Article is not inside a page.");
        return;
      }

      navigate(parentPage.id, article.id);
      return;
    }

    const backButton = event.target.closest("[data-back]");

    if (backButton) {
      event.preventDefault();

      const parentPage = backButton.closest(".page");

      if (parentPage) {
        navigate(parentPage.id);
      }
    }

  });

  // Mobile menu
  if (menuToggle && navigation) {

    menuToggle.addEventListener("click", () => {

      const opened = navigation.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(opened));

    });

  }

  // Browser back and forward
  function restoreHistory() {

    const hash = location.hash.replace(/^#/, "");

    if (!hash) {
      navigate("home", null, false);
      return;
    }

    const [pageId, articleId] = hash.split("/");

    navigate(pageId, articleId || null, false);
  }

  window.addEventListener("popstate", restoreHistory);

  // Initial page
  restoreHistory();

});