$(document).ready(function() {
  //Dropdown fix
  $('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
      $('.dropdown-submenu .show').removeClass("show");
    });


    return false;
  });
  // Item browse and search
  if ($('body').hasClass('resource browse') || $('body').hasClass('resource search')) {
    // Infinite scroll/load more
    // check if results have more than one page
    if ($('.pagination .next').length) {
      var status = $(`
        <div class="page-load-status">
          <div class="row justify-content-center pb-5 mb-5">
            <div class="col-auto">
              <div class="spinner-border infinite-scroll-request" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        `);
      status.hide();
      var loadButton = `
      <div class="row justify-content-center">
        <div class="col-auto">
          <button id="load-button" class="btn btn-fit-pink floating-action" type="button" aria-controls="searchFilters" aria-label="Load more results">
            <span class="action-container">
              <i class="fas fa-plus" aria-hidden="true" title="Load more results">
              </i>
              Load More
            </span>
          </button>
        </div>
      </div>
      `;
      $('.pagination-row').after(loadButton).after(status);
      $('#browse-container').attr('aria-live', 'polite')
      let nextURL;
      let appendElement = '.item-container';
      let currentItemCount;

      function updateNextURL(doc) {
        if ($(doc).find('.next').length) {
          nextURL = $(doc).find('.next').attr('href');
          if (!nextURL.includes('&scroll_request=true')) {
            nextURL = nextURL + '&scroll_request=true';
          }
        } else {
          nextURL = null;
        }
      }

      function getLinkData(doc) {
        if ($(doc).find('script[type="application/ld+json"]').length) {
          var newLinkData = $(doc).find('script[type="application/ld+json"]');
          $('script[type="application/ld+json"]').last().after(newLinkData);
        }
      }

      function updateFocus() {
        var firstLoadedElement = $(appendElement)[currentItemCount];
        $(firstLoadedElement).find('a.card-img').focus();
        getItemCount();
      }

      function getItemCount() {
        currentItemCount = $(appendElement).length
      }
      // get initial nextURL
      updateNextURL(document);
      getItemCount();
      let $container = $('#browse-container').infiniteScroll({
        // options
        // use function to set custom URLs
        path: function() {
          return nextURL;
        },
        checkLastPage: '.next',
        append: appendElement,
        scrollThreshold: false,
        button: '#load-button',
        hideNav: '.pagination-row',
        status: '.page-load-status',
        history: false,
      });
      // update nextURL on page load
      $container.on('load.infiniteScroll', function(event, body, path, response) {
        history.replaceState(null, null, path.replace('&scroll_request=true', ''));
        updateNextURL(body);
        getLinkData(body);
      });
      $container.on('append.infiniteScroll', function() {
        updateFocus();
      });
    }
    // Layout toggle
    function layoutList() {
      $('.btn.list').toggleClass("active", true).attr("aria-pressed", "true");
      $('.btn.grid').toggleClass("active", false).attr("aria-pressed", "false");
      $('#browse-container').hide().toggleClass("list", true).toggleClass("grid", false).fadeIn("slow");
      sessionStorage.setItem("browseLayout", "List");
    }

    function layoutGrid() {
      $('.btn.grid').toggleClass("active", true).attr("aria-pressed", "true");
      $('.btn.list').toggleClass("active", false).attr("aria-pressed", "false");
      $('#browse-container').hide().toggleClass("grid", true).toggleClass("list", false).fadeIn("slow");
      sessionStorage.setItem("browseLayout", "Grid");
    }
    if (sessionStorage.getItem("browseLayout")) {
      if (sessionStorage.getItem("browseLayout") == "List") {
        layoutList();
      } else if (sessionStorage.getItem("browseLayout") == "Grid") {
        layoutGrid();
      }
    }
    $('.btn.list').on("click", function() {
      layoutList();
    });
    $('.btn.grid').on("click", function() {
      layoutGrid();
    });

    //Date Facet Slider NoUI
    var slider = document.getElementById('date-facet-slider');
    var min = $(slider).data('min');
    var max = $(slider).data('max');
    var minInput = document.getElementById('dateRangeMin');
    var maxInput = document.getElementById('dateRangeMax');
    noUiSlider.create(slider, {
      start: [min, max],
      step: 1,
      range: {
        'min': min,
        'max': max
      }
    });
    slider.noUiSlider.on('update', function(values, handle) {
      var value = values[handle];

      if (handle) {
        maxInput.value = Math.round(value);
      } else {
        minInput.value = Math.round(value);
      }
    });
    minInput.addEventListener('change', function() {
      slider.noUiSlider.set([this.value, null]);
    });

    maxInput.addEventListener('change', function() {
      slider.noUiSlider.set([null, this.value]);
    });
    $('#dateRangeFacet').submit(function(event) {
      event.preventDefault();
      let url = new URL($(this).attr('action'));
      url.searchParams.append($(minInput).attr('name'), $(minInput).val());
      url.searchParams.append($(maxInput).attr('name'), $(maxInput).val());
      window.location.href = url;
    });
  }
  //Media viewer
  if ($('body').hasClass('show')) {
    //tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    //advance buttons
    $('#media-sidebar .btnNext').click(function() {
      var next = $('#mediaTab .nav-item').has('button.active').next('li');
      if (next.length) {
        $(next).children('button').trigger('click');
      } else {
        $("#mediaTab .nav-item:first").find('button').trigger('click');
      }
    });
    //clipboard
    $('.clip-button').each(function(index) {
      new ClipboardJS(this);
    });
    //toasts
    if ($('#embargo').length) {
      var embargo = $('#embargo');
      toast = new bootstrap.Toast(embargo);
      toast.show();
    }
  }
  //advanced search item set dropdown
  $('#advanced-search-modal #item-sets option:contains("Select item set…")').text('Select collection…')

  //Page slider glider.js
  if ($('body').hasClass('page')) {
    if ($('.glider').length) {
      $('.glider').each(function(index) {
        var id = 'glider-' + index;
        $(this).parent().parent().attr('id', id);
        new Glider(this, {
          slidesToShow: 1,
          slidesToScroll: 1,
          draggable: true,
          arrows: {
            prev: '#' + id + ' .btnPrevious',
            next: '#' + id + ' .btnNext'
          },
          responsive: [{
            // screens greater than >= 576px
            breakpoint: 576,
            settings: {
              // Set to `auto` and provide item width to adjust to viewport
              slidesToShow: 2,
              slidesToScroll: 2
            }
          }, {
            // screens greater than >= 768px
            breakpoint: 768,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3
            }
          }, {
            breakpoint: 992,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 4
            }
          }, {
            breakpoint: 1400,
            settings: {
              slidesToShow: 5,
              slidesToScroll: 5
            }
          }]
        });
      });

    }
  }
});