function loadCategories() {
    $.get("/categories/getCategories", function(data) {
        $("#categoryTable tbody").empty();
        $("#categorySelect").empty(); // Clear product category select
        $("#categorySelect").append("<option value=''>Select a Category</option>"); // Add default option
        $("#parentCategorySelect").empty(); // Clear parent category select
        $("#parentCategorySelect").append("<option value=''>Select a Parent Category</option>"); // Add default option

        if (data && Array.isArray(data)) {
            $.each(data, function(i, category) {
                var parentCategoryName = category.parentCategory ? category.parentCategory.name : ""; // Handle null parent category
                var row = "<tr id='categoryRow" + category.id + "'>" +
                    "<td>" + (category.name || "") + "</td>" +
                    "<td>" + (category.description || "") + "</td>" +
                    "<td>" + parentCategoryName + "</td>" +
                    "<td>" +
                    "<button type='button' class='btn btn-primary editCategory' data-category-id='" + category.id + "'>Edit</button>" +
                    "<button type='button' class='btn btn-danger deleteCategory' data-category-id='" + category.id + "'>Delete</button>" +
                    "</td>" +
                    "</tr>";
                $("#categoryTable tbody").append(row);

                // Add to product category select (only if not editing a category)
                if(!$("#categoryId").val()){
                    $("#categorySelect").append($("<option>", {
                        value: category.id,
                        text: category.name
                    }));
                }


                $("#parentCategorySelect").append($("<option>", {
                    value: category.id,
                    text: category.name
                }));
            });
            $("#categorySelect").append("<option value='new'>Manage Categories</option>");
        } else {
            console.error("Invalid or empty category data received:", data);
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching categories:", textStatus, errorThrown);
        alert("Error fetching categories. Please check the console for details.");
    });
}

$(document).on("click", ".editCategory", function(event) {
    event.preventDefault();
    event.stopPropagation();
    var categoryId = $(this).data("category-id");
    console.log("Category ID:", categoryId);
    if (isNaN(categoryId)) {
        console.error("Category ID is not a number:", categoryId);
        alert("Invalid category ID. Please check the data attributes.");
        return;
    }
    $.get("/categories/getCategory/" + categoryId, function(category) { // Corrected URL: /categories/...
        $("#newCategoryForm #categoryId").val(category.id);
        $("#newCategoryForm #newCategoryName").val(category.name);
        $("#newCategoryForm #newCategoryDescription").val(category.description);
        $("#newCategoryForm #parentCategorySelect").val(category.parentCategory ? category.parentCategory.id : "");
        $('#categoryModal').modal('show');
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching category for edit:", textStatus, errorThrown);
        alert("Error fetching category. Please check the console.");
    });
});

$("#newCategoryForm").submit(function(event) {
    event.preventDefault();
    var csrfToken = $("meta[name='_csrf']").attr("content");
    var csrfHeader = $("meta[name='_csrf_header']").attr("content");

    var parentCategoryId = $("#parentCategorySelect").val();
    var parentCategory = parentCategoryId ? { id: parentCategoryId } : null;

    var formData = {
        id: $("#categoryId").val(),
        name: $("#newCategoryName").val(),
        description: $("#newCategoryDescription").val(),
        parentCategory: parentCategory
    };

    $.ajax({
        type: "POST",
        url: "/categories/saveCategory",
        data: JSON.stringify(formData), // Serialize to JSON
        contentType: "application/json", // Crucial: Set content type to JSON
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeader, csrfToken);
        },
        success: function(response) {
            loadCategories();
            $("#newCategoryForm")[0].reset();
            $("#newCategoryForm #categoryId").val("");
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

$(document).on("click", ".deleteCategory", function() {
    var categoryId = $(this).data("category-id");
    var csrfToken = $("meta[name='_csrf']").attr("content");
    var csrfHeader = $("meta[name='_csrf_header']").attr("content");

    if (confirm("Are you sure you want to delete this category?")) {
        $.ajax({
            type: "DELETE",
            url: "/categories/deleteCategory/" + categoryId, // Corrected URL
            beforeSend: function(xhr) {
                xhr.setRequestHeader(csrfHeader, csrfToken);
            },
            success: function(response) {
                loadCategories();
                alert(response);
            },
            error: function(xhr, status, error) {
                console.error("Error deleting category:", xhr.responseText);
                alert("Error deleting category: " + xhr.responseText);
            }
        });
    }
});