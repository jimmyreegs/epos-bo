// Fetch available locales when the page loads and ORDER them
let availableLocales = [];
const systemLocale = $("#locale").val();

$.get("/products/availableLocales", function(data) {
    availableLocales = [...data].sort((a, b) => {
        if (a === systemLocale) return -1;
        if (b === systemLocale) return 1;
        return a.localeCompare(b);
    });
}).fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error fetching available locales:", textStatus, errorThrown);
    // Handle error appropriately, e.g., display a message to the user
});

function generateNameAndDescriptionFields(product, locale) {
    return `
        <div class="mb-3">
            <label for='name_${locale}' class="form-label">Name (${locale}):</label>
            <input type='text' class='form-control w-100' name='name_${locale}' value='${product?.name?.[locale] || ""}'>
            <br>
            <label for='description_${locale}' class="form-label">Description (${locale}):</label>
            <textarea class='form-control w-100' name='description_${locale}'>${product?.description?.[locale] || ""}</textarea>
        </div>
    `;
}

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
                const categoryName = product.category ? product.category.name || "" : "";

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

$(document).on("change", "#addLocaleSelect", function() {
    const selectedLocale = $(this).val();
    if (selectedLocale) {
        const currentLocales = [];
        $("[name^='name_']").each(function() {
            currentLocales.push($(this).attr("name").split("_")[1]);
        });
        $("[name^='description_']").each(function() {
            currentLocales.push($(this).attr("name").split("_")[1]);
        });
        const uniqueLocales = [...new Set(currentLocales)];

        if (!uniqueLocales.includes(selectedLocale)) {
            const newFields = generateNameAndDescriptionFields({name:{[selectedLocale]: ""}, description:{[selectedLocale]: ""}}, selectedLocale);
            $("#nameFields").find("#addLocaleSelect").before(newFields); // Insert BEFORE the dropdown

            $(this).val(""); // Reset the dropdown
        } else {
            alert("This language has already been added.");
        }
    }
});

// Handle the product modal with dynamic logic
$(document).off("click", "[data-bs-target='#productModal']").on("click", "[data-bs-target='#productModal']", function(event) {
    event.preventDefault();

    $("#localeTabs").html("");
    $("#localeTabsContent").html("");

    availableLocales.forEach(locale => {
        let flag = "";
        switch (locale) {
            case "en": flag = "🇬🇧"; break; // UK flag
            case "en-US": flag = "🇺🇸"; break; // US English
            default: flag = locale.toUpperCase();
        }
        $("#localeTabs").append(`
            <li class="nav-item" role="presentation">
                <button class="nav-link ${locale === systemLocale ? 'active' : ''}" id="${locale}-tab" type="button">${flag}</button>
            </li>
        `);
        $("#localeTabsContent").append(`
            <div class="tab-pane fade ${locale === systemLocale ? 'show active' : ''}" id="${locale}" role="tabpanel">
                ${generateNameAndDescriptionFields({}, locale)}
            </div>
        `);
    });

    populateCategoryDropdown();
    loadProductsInModal();
    $('#productModal').modal('show');
});
