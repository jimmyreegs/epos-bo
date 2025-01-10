// Declare systemLocale globally
window.systemLocale = $("#locale").val(); // Use window to make it globally accessible

// In products.js
function generateLocaleFields(item, locale, fieldPrefix) {
    const flag = locale === "en" ? "🇬🇧" : locale === "en-US" ? "🇺🇸" : locale.toUpperCase();
    const nameId = `${fieldPrefix}_name_${locale}`;
    const descriptionId = `${fieldPrefix}_description_${locale}`;

    const tab = `
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="${fieldPrefix}-${locale}-tab" data-bs-toggle="tab" data-bs-target="#${fieldPrefix}-${locale}" type="button" role="tab" aria-controls="${fieldPrefix}-${locale}" aria-selected="false">${flag}</button>
        </li>
    `;

    const content = `
        <div class="tab-pane fade" id="${fieldPrefix}-${locale}" role="tabpanel" aria-labelledby="${fieldPrefix}-${locale}-tab">
            <div class="mb-3">
                <label for="${nameId}" class="form-label">Name (${locale}):</label>
                <input type="text" class="form-control w-100" name="${nameId}" value="${item?.name?.[locale] || ""}">
                <br>
                <label for="${descriptionId}" class="form-label">Description (${locale}):</label>
                <textarea class="form-control w-100" name="${descriptionId}">${item?.description?.[locale] || ""}</textarea>
            </div>
        </div>
    `;

    return { tab, content };
}

$(document).ready(function () {
    // Fetch available locales when the page loads and ORDER them
    window.availableLocales = []; // Make availableLocales global

    $.get("/products/availableLocales", function (data) {
        if (data && data.length > 0) {
            window.availableLocales = [...data].sort((a, b) => {
                if (a === window.systemLocale) return -1;
                if (b === window.systemLocale) return 1;
                return a.localeCompare(b);
            });
        } else {
            console.warn("No available locales received from server.");
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching available locales:", textStatus, errorThrown);
    });

    // Generalized modal reset function
    function resetModal(modalId, formId, fieldsToClear = []) {
        const form = $(`#${formId}`);
        if (form.length) {
            form[0].reset();
            fieldsToClear.forEach((fieldId) => {
                $(`#${fieldId}`).val("");
            });
        } else {
            console.warn(`Form with ID "${formId}" not found.`);
        }
    }

    // Reset Product Modal on close
    $('#productModal').on('hidden.bs.modal', function () {
        resetModal('productModal', 'productForm', ['productForm #id', 'nameFields', 'descriptionFields']);
        $("#nameFields").empty();
        $("#descriptionFields").empty();
    });

    // Reset Category Modal on close
    $('#categoryModal').on('hidden.bs.modal', function () {
        resetModal('categoryModal', 'newCategoryForm', ['newCategoryForm #categoryId']);
    });

    // Open category modal from product modal
    $("#productModal #categorySelect").change(function () {
        if ($(this).val() === "new") {
            $('#categoryModal').modal('show');
            $(this).val("");
        }
    });
});
