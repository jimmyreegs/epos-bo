// Fetch categories and populate the dropdown AND handle "Manage Categories"
function populateCategoryDropdown() {
    $.get("/products/getCategories", function(categories) {
        const $categorySelect = $("#productForm #categorySelect");
        $categorySelect.empty();
        $categorySelect.append("<option value=''>Select Category</option>");
        $categorySelect.append("<option value='manage'>Manage Categories</option>");

        if (categories && Array.isArray(categories)) {
            categories.forEach(category => {
                $categorySelect.append(`<option value="${category.id}">${category.name}</option>`);
            });
        } else {
            console.error("Invalid categories data received:", categories);
        }

        $categorySelect.off("change").on("change", function() { // Use .off() to prevent duplicate handlers
            if ($(this).val() === "manage") {
                $('#productModal').modal('hide');
                $('#categoryModal').modal('show');
                $(this).val("");
            }
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching categories:", textStatus, errorThrown);
    });
}

$(document).on("click", "[data-bs-target='#productModal']", function() {
    var $productForm = $("#productForm");
    $productForm[0].reset();
    $productForm.find("#id").val("");

    const systemLanguage = $("#locale").val();
    $("#nameFields").html(generateNameAndDescriptionFields({name:{[systemLanguage]:""}, description:{[systemLanguage]:""}}, systemLanguage));
    $("#descriptionFields").empty();

    populateCategoryDropdown(); // Call the function to populate the dropdown
    $('#productModal').modal('show');
});