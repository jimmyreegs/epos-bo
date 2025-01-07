// Fetch available locales when the page loads
let availableLocales = [];
$.get("/products/availableLocales", function(data) {
    availableLocales = data;
});

function generateNameAndDescriptionFields(product, locale) {
    return `
        <div class='form-group' id='name-group-${locale}'>
            <label for='name_${locale}'>Name (${locale}):</label>
            <input type='text' class='form-control' name='name_${locale}' value='${product?.name?.[locale] || ""}'>
        </div>
        <div class='form-group' id='description-group-${locale}'>
            <label for='description_${locale}'>Description (${locale}):</label>
            <textarea class='form-control' name='description_${locale}'>${product?.description?.[locale] || ""}</textarea>
        </div>
    `;
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

            //Find the relevant dropdown in description fields, and insert before
            $("#descriptionFields").find("#addLocaleSelect").before(newFields);

            $(this).val(""); // Reset the dropdown
        } else {
            alert("This language has already been added.");
        }
    }
});

$("#productForm").submit(function(event) {
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
            loadProducts();
            loadProductsInModal();
            $("#productForm")[0].reset();
            $("#productForm #id").val("");
            $("#nameFields").empty();
            $("#descriptionFields").empty();
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