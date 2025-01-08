// Declare systemLocale globally
window.systemLocale = $("#locale").val();  // Use window to make it globally accessible

$(document).ready(function() {
    // Fetch available locales when the page loads and ORDER them
    window.availableLocales = []; // Make availableLocales global

    $.get("/products/availableLocales", function(data) {
        if (data && data.length > 0) {
            window.availableLocales = [...data].sort((a, b) => {
                if (a === window.systemLocale) return -1;
                if (b === window.systemLocale) return 1;
                return a.localeCompare(b);
            });
        } else {
            console.warn("No available locales received from server.");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching available locales:", textStatus, errorThrown);
    });

    $('#categoryModal').on('shown.bs.modal', function (event) {
        //loadCategories();
    });

    // Reset Product Modal on close
    $('#productModal').on('hidden.bs.modal', function () {
        $("#productForm")[0].reset();
        $("#productForm #id").val("");
        $("#nameFields").empty();
        $("#descriptionFields").empty();
    });

    // Reset Category Modal on close
    $('#categoryModal').on('hidden.bs.modal', function () {
        $("#newCategoryForm")[0].reset();
        $("#newCategoryForm #categoryId").val("");
    });

    // Open category modal from product modal
    $("#productModal #categorySelect").change(function() {
        if ($(this).val() === "new") {
            $('#categoryModal').modal('show');
            $(this).val("");
        }
    });
});
