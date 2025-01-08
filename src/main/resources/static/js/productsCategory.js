$(document).off("click", "[data-bs-target='#categoryModal']").on("click", "[data-bs-target='#categoryModal']", function() {
    $("#categoryLocaleTabs").html("");
    $("#categoryLocaleTabsContent").html("");
    $("#categoryForm")[0].reset();
    $("#categoryForm #id").val("");

    window.availableLocales.forEach(locale => { // Use window.availableLocales
        let flag = "";
        switch (locale) {
            case "en": flag = "🇬🇧"; break;
            case "en-US": flag = "🇺🇸"; break;
            case "es": flag = "🇪🇸"; break;
            case "fr": flag = "🇫🇷"; break;
            case "de": flag = "🇩🇪"; break;
            default: flag = locale.toUpperCase();
        }
        $("#categoryLocaleTabs").append(`
            <li class="nav-item" role="presentation">
                <button class="nav-link ${locale === $("#locale").val() ? 'active' : ''}" id="category-${locale}-tab" data-bs-toggle="tab" data-bs-target="#category-${locale}" type="button" role="tab" aria-controls="category-${locale}" aria-selected="${locale === $("#locale").val()}">${flag}</button>
            </li>
        `);
        $("#categoryLocaleTabsContent").append(`
            <div class="tab-pane fade ${locale === $("#locale").val() ? 'show active' : ''}" id="category-${locale}" role="tabpanel" aria-labelledby="category-${locale}-tab">
                <div class="mb-3">
                    <label for='name_${locale}' class="form-label">Name (${locale}):</label>
                    <input type='text' class='form-control w-100' name='name_${locale}' value=''>
                    <br>
                    <label for='description_${locale}' class="form-label">Description (${locale}):</label>
                    <textarea class='form-control w-100' name='description_${locale}'></textarea>
                </div>
            </div>
        `);
    });
    $('#categoryModal').modal('show');
});

$(document).off("submit", "#categoryForm").on("submit", "#categoryForm", function(event) {
    event.preventDefault();
    var csrfToken = $("meta[name='_csrf']").attr("content");
    var csrfHeader = $("meta[name='_csrf_header']").attr("content");
    var name = {};
    var description = {};

    $("[name^='name_']").each(function() {
        var locale = $(this).attr("name").split("_")[1];
        name[locale] = $(this).val();
    });

    $("[name^='description_']").each(function() {
        var locale = $(this).attr("name").split("_")[1];
        description[locale] = $(this).val();
    });

    var formData = {
        id: $("#category-id").val(),
        reference: $("#category-reference").val(),
        name: name,
        description: description,
        parentCategoryId: $("#parentCategorySelect").val()
    };

    $.ajax({
        type: "POST",
        url: "/categories/save",
        data: JSON.stringify(formData),
        contentType: "application/json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeader, csrfToken);
        },
        success: function(response) {
            alert(response);
            $('#categoryModal').modal('hide');
            loadCategories();//Function to reload your category list
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
function loadCategories() {
    $.get("/categories/getCategories", function(categories) {
        // ... (Existing table loading logic remains unchanged)
    }).fail(function(jqXHR, textStatus, errorThrown) {
        // ... (Existing error handling remains unchanged)
    });
}