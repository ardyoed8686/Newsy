$(document).ready(function() {
  var articleContainer = $(".article-container");
  // Grab the articles as a json
  $(document).on("click", "btn.scrape-new", handleScrapeArticles);
  $(document).on("click", "btn.save", handleSaveArticle);

// load page with no articles scraped
  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/articles?saved=false").then(function(data) {
      if (data && data.length) {
        renderArticles(data);
      }
      else {
        renderEmpty();
      }
    });
  }

  function handleScrapeArticles() {

    $.get("/api/fetch").then(function(data) {
      initPage();
      bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
    });
  }

  // save aricle
  function handleSaveArticle() {
    var saveArticle = $(this).parents(".panel").data();
    saveArticle.saved = true;
      $.ajax({
      method: "PUT",
      url: "/api/articles",
      data: saveArticle
    }).then(function(data) {

      if (data.ok) {
        initPage();
      }
    });
  }

  function renderArticles(articles) {
    var articlePanels = [];
    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }
    articleContainer.append(articlePanels);
  }
 
  function createPanel(article) {
    var panel = $(
      [
        "<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        "<a class='article-link' target='_blank' href='" + article.link + "'>",
        article.title,
        "</a>",
        "<a class='btn btn-info save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join("")
    );
    panel.data("_id", article._id);
    return panel;
  }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    articleContainer.append(emptyAlert);
  }
})

