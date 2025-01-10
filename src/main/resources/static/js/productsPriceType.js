const PriceTypeConstants = {
    DEFAULT_PRICE_TYPE_NAME: "Default"
};

function loadPriceTypes() {
  $.get("/priceTypes/getPriceTypes", function(priceTypes) {
    const $priceTypeTableBody = $("#priceTypeTableInModal tbody");
    $priceTypeTableBody.empty();

    if (priceTypes && Array.isArray(priceTypes)) {
      priceTypes.forEach(priceType => {
        let row = `
                    <tr>
                        <td>${priceType.name}</td>
                        <td>${priceType.description}</td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-price-type" data-price-type-id="${priceType.id}">Edit</button>
                            <button class="btn btn-sm btn-danger delete-price-type" data-price-type-id="${priceType.id}">Delete</button>
                        </td>
                    </tr>
                `;

        // Disable buttons for the default price type
        if (priceType.name === PriceTypeConstants.DEFAULT_PRICE_TYPE_NAME) {
          // Find the buttons within the current row and disable them.
          const $row = $(row); // Create a jQuery object from the row string
          $row.find(".edit-price-type, .delete-price-type").prop("disabled", true);
          row = $row.prop('outerHTML'); // Update the row variable with the modified row
        }

        $priceTypeTableBody.append(row);
      });
    } else {
      console.error("Invalid price types data received:", priceTypes);
      $priceTypeTableBody.append("<tr><td colspan='3'>No price types found.</td></tr>");
    }
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error fetching price types:", textStatus, errorThrown);
    $("#priceTypeTableInModal tbody").append("<tr><td colspan='3'>Error loading price types.</td></tr>");
  });
}

// Open the price type modal
$(document).off("click", "[data-bs-target='#priceTypeModal']").on("click", "[data-bs-target='#priceTypeModal']", function() {
    $("#priceTypeForm")[0].reset(); // Clear form fields
    $("#priceTypeId").val(""); // Clear hidden ID field
    loadPriceTypes();
    $('#priceTypeModal').modal('show');
});

// Submit price type form
$(document).off("submit", "#priceTypeForm").on("submit", "#priceTypeForm", function(event) {
    event.preventDefault();

    const csrfToken = $("meta[name='_csrf']").attr("content");
    const csrfHeader = $("meta[name='_csrf_header']").attr("content");

    const formData = {
        id: $("#priceTypeId").val(),
        name: $("#priceTypeName").val(),
        description: $("#priceTypeDescription").val()
    };

    $.ajax({
        type: "POST",
        url: "/priceTypes/savePriceType",
        data: JSON.stringify(formData),
        contentType: "application/json",
        beforeSend: function(xhr) {
            xhr.setRequestHeader(csrfHeader, csrfToken);
        },
        success: function(response) {
            loadPriceTypes();
            $("#priceTypeForm")[0].reset();
            alert(response);
        },
        error: function(xhr, status, error) {
            console.error("Error saving price type:", xhr);
            alert("Error saving price type.");
        }
    });
});

// Edit price type
$(document).off("click", ".edit-price-type").on("click", ".edit-price-type", function() {
    const priceTypeId = $(this).data("price-type-id");

    $.get(`/priceTypes/getPriceType/${priceTypeId}`, function(priceType) {
        $("#priceTypeId").val(priceType.id);
        $("#priceTypeName").val(priceType.name);
        $("#priceTypeDescription").val(priceType.description);
        $('#priceTypeModal').modal('show');
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error("Error fetching price type for edit:", textStatus, errorThrown);
    });
});

// Delete price type
$(document).off("click", ".delete-price-type").on("click", ".delete-price-type", function() {
    const priceTypeId = $(this).data("price-type-id");
    const csrfToken = $("meta[name='_csrf']").attr("content");
    const csrfHeader = $("meta[name='_csrf_header']").attr("content");

    if (confirm("Are you sure you want to delete this price type?")) {
        $.ajax({
            type: "DELETE",
            url: `/priceTypes/deletePriceType/${priceTypeId}`,
            beforeSend: function(xhr) {
                xhr.setRequestHeader(csrfHeader, csrfToken);
            },
            success: function(response) {
                alert(response);
                loadPriceTypes();
            },
            error: function(xhr, status, error) {
                console.error("Error deleting price type:", xhr);
                alert("Error deleting price type.");
            }
        });
    }
});