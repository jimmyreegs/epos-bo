// Fetch categories and populate the dropdown AND handle "Manage Categories"
function populateParentCategoryDropdown() {
    $.get("/categories/getCategories", function(categories) {
        const $parentCategorySelect = $("#parentCategorySelect");
        $parentCategorySelect.empty(); // Clear existing options

        // Add a default "No Parent" option
        $parentCategorySelect.append('<option value="">No Parent</option>');

        if (categories && Array.isArray(categories)) {
            categories.forEach(category => {
                $parentCategorySelect.append(`<option value="${category.id}">${category.reference}</option>`);
            });
        } else {
            console.error("Invalid categories data received:", categories);
            // Optionally, you could display a message within the dropdown itself:
            $parentCategorySelect.append('<option value="">Error loading categories</option>');
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching categories:", textStatus, errorThrown);
        // Optionally, you could display a message within the dropdown itself:
        $parentCategorySelect.append('<option value="">Error loading categories</option>');
    });
}
// Load categories into the table
function loadCategories() {
  $.get("/categories/getCategories", function(categories) {
    const $categoryTableBody = $("#categoryTableInModal tbody");
    $categoryTableBody.empty();

    if (categories && Array.isArray(categories)) {
      categories.forEach(category => {
        const categoryReference = category.reference || "";
        const categoryName = category.name && category.name["en"] ? category.name["en"] : "";
        const categoryDescription = category.description && category.description["en"] ? category.description["en"] : "";
        const categoryParent = category.parentCategory ? category.parentCategory.reference : "";

        const row = `
          <tr>
              <td>${categoryReference}</td>
              <td>${categoryName}</td>
              <td>${categoryDescription}</td>
              <td>${categoryParent}</td>
              <td>
                  <button class="btn btn-sm btn-primary edit-category" data-category-id="${category.id}">Edit</button>
                  <button class="btn btn-sm btn-danger delete-category" data-category-id="${category.id}">Delete</button>
              </td>
          </tr>
        `;

        $categoryTableBody.append(row);
      });
    } else {
      console.error("Invalid categories data received:", categories);
      $categoryTableBody.append("<tr><td colspan='4'>No categories found.</td></tr>");
    }
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error fetching categories:", textStatus, errorThrown);
    $("#categoryTable tbody").append("<tr><td colspan='4'>Error loading categories.</td></tr>");
  });
}

// Open the category modal for adding a new category
$(document).off("click", "[data-bs-target='#categoryModal']").on("click", "[data-bs-target='#categoryModal']", function() {
    // Clear modal fields
    $("#categoryForm")[0].reset();
    $("#categoryForm #id").val("");
    $("#categoryLocaleTabs").html("");
    $("#categoryLocaleTabsContent").html("");

    availableLocales.forEach(locale => {
        const { tab, content } = generateLocaleFields({}, locale, "category"); // "category" prefix
        $("#categoryLocaleTabs").append(tab);
        $("#categoryLocaleTabsContent").append(content);
    });

    // Set the first locale as active
    const activeLocale = window.systemLocale || availableLocales[0];
    $(`#category-${activeLocale}-tab`).addClass("active");
    $(`#category-${activeLocale}`).addClass("show active");

    populateParentCategoryDropdown();
    loadCategories();
    $('#categoryModal').modal('show');
});

// Submit category form
$(document).off("submit", "#categoryForm").on("submit", "#categoryForm", function(event) {
    event.preventDefault();

    const csrfToken = $("meta[name='_csrf']").attr("content");
    const csrfHeader = $("meta[name='_csrf_header']").attr("content");
    const name = {};
    const description = {};

    $("[name^='category_name_']").each(function() {
        const locale = $(this).attr("name").split("_")[2];
        name[locale] = $(this).val();
    });

    $("[name^='category_description_']").each(function() {
        const locale = $(this).attr("name").split("_")[2];
        description[locale] = $(this).val();
    });

    const formData = {
        id: $("#categoryId").val(),
        reference: $("#categoryReference").val(),
        name: name,
        description: description,
        parentCategory: { id: $("#parentCategorySelect").val() } // Important addition

    };

    $.ajax({
        type: "POST",
        url: "/categories/saveCategory",
        data: JSON.stringify(formData),
        contentType: "application/json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeader, csrfToken);
        },
        success: function(response) {
            loadCategories();
            $("#categoryForm")[0].reset();
            $("#categoryForm #id").val("");

            alert(response);
        },
        error: function(xhr, status, error) {
            console.error("Error saving category:", xhr);
            if (xhr.responseJSON && xhr.responseJSON.message) {
                alert("Error saving category: " + xhr.responseJSON.message);
            } else {
                alert("An error occurred while saving the category.");
            }
        }
    });
});

// Edit category
$(document).off("click", ".edit-category").on("click", ".edit-category", function() {
    const categoryId = $(this).data("category-id");

    $.get(`/categories/getCategory/${categoryId}`, function(category) {
        $("#categoryId").val(category.id);
        $("#categoryReference").val(category.reference);
        $("#parentCategorySelect").val(category.parentCategory ? category.parentCategory.id : "");



        $("#categoryLocaleTabs").html("");
        $("#categoryLocaleTabsContent").html("");

        availableLocales.forEach(locale => {
            const { tab, content } = generateLocaleFields({}, locale, "category"); // "category" prefix
            $("#categoryLocaleTabs").append(tab);
            $("#categoryLocaleTabsContent").append(content);

            // Set the input field values *after* appending to the DOM
            $(`[name='category_name_${locale}']`).val(category.name ? category.name[locale] : "");
            $(`[name='category_description_${locale}']`).val(category.description ? category.description[locale] : "");
        });

        const activeLocale = window.systemLocale || availableLocales[0];
        $(`#category-${activeLocale}-tab`).addClass("active");
        $(`#category-${activeLocale}`).addClass("show active");

        $('#categoryModal').modal('show');
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching category for edit:", textStatus, errorThrown);
    });
});

// Delete category
$(document).off("click", ".delete-category").on("click", ".delete-category", function() {
    const categoryId = $(this).data("category-id");
    const csrfToken = $("meta[name='_csrf']").attr("content");
    const csrfHeader = $("meta[name='_csrf_header']").attr("content");

    if (confirm("Are you sure you want to delete this category?")) {
        $.ajax({
            type: "DELETE",
            url: `/categories/deleteCategory/${categoryId}`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader(csrfHeader, csrfToken);
            },
            success: function(response) {
                alert(response);
                loadCategories();
            },
            error: function(xhr, status, error) {
                console.error("Error deleting category:", xhr);
                alert("Error deleting category.");
            }
        });
    }
});
