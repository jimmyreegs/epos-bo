// Fetch categories and populate the dropdown AND handle "Manage Categories"
function populateCategoryDropdown() {
    $.get("/categories/getCategories", function(categories) {
        const $categorySelect = $("#productForm #categorySelect");
        $categorySelect.empty();
        $categorySelect.append("<option value=''>Select Category</option>");
        $categorySelect.append("<option value='manage'>Manage Categories</option>");

        if (categories && Array.isArray(categories)) {
            categories.forEach(category => {
                $categorySelect.append(`<option value="${category.id}">${category.reference}</option>`);
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

// Function to load products into the modal table
function loadProductsInModal() {
    $.get("/products/getProducts", function(products) {
        const $productTableBody = $("#productTableInModal tbody");
        $productTableBody.empty();

        if (products && Array.isArray(products)) {
            products.forEach(product => {
                const reference = product.reference || "";
                const name = product.name && product.name["en"] ? product.name["en"] : "";
                const description = product.description && product.description["en"] ? product.description["en"] : "";
                const categoryName = product.category ? product.category.reference || "" : "";

                const row = `
                    <tr>
                        <td>${reference}</td>
                        <td>${name}</td>
                        <td>${description}</td>
                        <td>${categoryName}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-product" data-product-id="${product.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-product" data-product-id="${product.id}">Delete</button>
                        </td>
                    </tr>
                `;
                $productTableBody.append(row);
            });
        } else {
            console.error("Invalid products data received:", products);
            $productTableBody.append("<tr><td colspan='5'>No products found.</td></tr>");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching products:", textStatus, errorThrown);
        $("#productTableInModal tbody").append("<tr><td colspan='5'>Error loading products.</td></tr>");
    });
}

$("#productForm").submit(function(event) {
    event.preventDefault();
    var csrfToken = $("meta[name='_csrf']").attr("content");
    var csrfHeader = $("meta[name='_csrf_header']").attr("content");
    var name = {};
    var description = {};

    $("[name^='product_name_']").each(function() {
        var locale = $(this).attr("name").split("_")[2];
        name[locale] = $(this).val();
    });

    $("[name^='product_description_']").each(function() {
        var locale = $(this).attr("name").split("_")[2];
        description[locale] = $(this).val();
    });

    var formData = {
        id: $("#id").val(),
        reference: $("#reference").val(),
        name: name,
        description: description,
        category: { id: $("#categorySelect").val() }
    };

    $.ajax({
        type: "POST",
        url: "/products/save",
        data: JSON.stringify(formData),
        contentType: "application/json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeader, csrfToken);
        },
        success: function(response) {
            loadProductsInModal();
            $("#productForm")[0].reset();
            $("#productForm #id").val("");

            alert(response);
        },
        error: function(xhr, status, error) {
            console.error("Error saving product:", xhr);
            if (xhr.responseJSON && xhr.responseJSON.message) {
                alert("Error saving product: " + xhr.responseJSON.message);
            } else {
                alert("An error occurred while saving the product.");
            }
        }
    });
});

$(document).on("change", "#addLocaleSelect", function() {
    const selectedLocale = $(this).val();
    if (selectedLocale) {
        const currentLocales = [];
        $("[name^='product_name_']").each(function() {
            currentLocales.push($(this).attr("name").split("_")[2]);
        });
        $("[name^='product_description_']").each(function() {
            currentLocales.push($(this).attr("name").split("_")[2]);
        });
        const uniqueLocales = [...new Set(currentLocales)];

        if (!uniqueLocales.includes(selectedLocale)) {
            const newFields = generateLocaleFields({name:{[selectedLocale]: ""}, description:{[selectedLocale]: ""}}, selectedLocale, "product"); // Added "product" prefix
            $("#localeTabsContent").append(newFields.content); // Append content to the correct container
            $("#localeTabs").append(newFields.tab); // Append tab to the correct container
            $(`#product-${selectedLocale}-tab`).tab('show'); // Show the newly added tab
            $(this).val("");
        } else {
            alert("This language has already been added.");
        }
    }
});


$(document).off("click", "[data-bs-target='#productModal']").on("click", "[data-bs-target='#productModal']", function(event) {
    event.preventDefault();

    // Clear previous content (tabs and tab content)
    $("#localeTabs").html("");
    $("#localeTabsContent").html("");

    // Loop through available locales and add tabs and content
    availableLocales.forEach(locale => {
        const { tab, content } = generateLocaleFields({}, locale, "product"); // "product" prefix
        $("#localeTabs").append(tab);
        $("#localeTabsContent").append(content);
    });

    const activeLocale = window.systemLocale || availableLocales[0];
    $(`#product-${activeLocale}-tab`).addClass("active");
    $(`#product-${activeLocale}`).addClass("show active");

    // Show the modal for creating a new product
    populateCategoryDropdown();
    loadProductsInModal();
    $('#productModal').modal('show');
});


$(document).off("click", ".edit-product").on("click", ".edit-product", function() {
    const productId = $(this).data("product-id");

    $.get(`/products/getProduct/${productId}`, function(product) {
        $("#id").val(product.id);
        $("#reference").val(product.reference);
        $("#categorySelect").val(product.category ? product.category.id : "");

        $("#localeTabs").html("");
        $("#localeTabsContent").html("");

        availableLocales.forEach(locale => {
            const { tab, content } = generateLocaleFields(product, locale, "product");
            $("#localeTabs").append(tab);
            $("#localeTabsContent").append(content);

            // Set the input field values *after* appending to the DOM
            $(`[name='product_name_${locale}']`).val(product.name ? product.name[locale] : "");
            $(`[name='product_description_${locale}']`).val(product.description ? product.description[locale] : "");
        });

        const activeLocale = window.systemLocale || availableLocales[0];
        $(`#product-${activeLocale}-tab`).addClass("active");
        $(`#product-${activeLocale}`).addClass("show active");

        $('#productModal').modal('show');
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching product for edit:", textStatus, errorThrown);
    });
});


$(document).on("click", ".delete-product", function() {
    const productId = $(this).data("product-id");
    var csrfToken = $("meta[name='_csrf']").attr("content");
    var csrfHeader = $("meta[name='_csrf_header']").attr("content");
    if (confirm("Are you sure you want to delete this product?")) {
        $.ajax({
            type: "DELETE",
            url: `/products/delete/${productId}`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader(csrfHeader, csrfToken);
            },
            success: function(response) {
                alert(response);
                loadProductsInModal();
            },
            error: function(xhr, status, error) {
                console.error("Error deleting product:", xhr);
                alert("Error deleting product.");
            }
        });
    }
});