$(document).ready(function() {
    // Load data on modal shown (Corrected event)
    $('#productModal').on('shown.bs.modal', function (event) {
        loadProducts();
    });

    $('#categoryModal').on('shown.bs.modal', function (event) {
        loadCategories();
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