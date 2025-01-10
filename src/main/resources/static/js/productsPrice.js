function populatePriceTypeDropdown() {
    $.get("/priceTypes/getPriceTypes", function(priceTypes) {
        const $priceTypeSelect = $("#priceTypeSelect");
        $priceTypeSelect.empty();
        $priceTypeSelect.append('<option value="">Select a Price Type</option>');
        priceTypes.forEach(priceType => {
            $priceTypeSelect.append(`<option value="${priceType.id}">${priceType.name}</option>`);
        });
    });
}

function loadPrices() {
    // This function will fetch and display existing prices (implementation later)
    // For now, it's a placeholder.
    const $priceTableBody = $("#priceTableInModal tbody");
    $priceTableBody.empty();
    $priceTableBody.append("<tr><td colspan='3'>No prices found.</td></tr>"); // Placeholder
}

$(document).off("click", "[data-bs-target='#priceModal']").on("click", "[data-bs-target='#priceModal']", function() {
    $("#priceForm")[0].reset();
    $("#priceId").val("");
    populatePriceTypeDropdown();
    loadPrices();
    $("#priceModal").modal("show");
});

$(document).off("submit", "#priceForm").on("submit", "#priceForm", function(event) {
    event.preventDefault();

    const csrfToken = $("meta[name='_csrf']").attr("content");
    const csrfHeader = $("meta[name='_csrf_header']").attr("content");

    const formData = {
        id: $("#priceId").val(),
        priceType: { id: $("#priceTypeSelect").val() },
        amount: $("#priceAmount").val()
    };

    $.ajax({
        type: "POST",
        url: "/prices/savePrice",
        data: JSON.stringify(formData),
        contentType: "application/json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeader, csrfToken);
        },
        success: function(response) {
            loadPrices();
            $("#priceForm")[0].reset();
            alert(response);
        },
        error: function(xhr, status, error) {
            console.error("Error saving price:", xhr);
            alert("Error saving price.");
        }
    });
});

// Add edit and delete functionality later