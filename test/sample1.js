(function () {
    "use strict";

    /*global $, freezeInterface, updateInterfaceUsingData, unfreezeInterface*/
    /*global showError*/

    // Handles the click on a specific button
    function onClick () {
        freezeInterface("Please wait, updating information...");
        $.ajax("getInformation.aspx", {
            success: function (data) {
                var resultCode = data.resultCode;
                if (resultCode === 0) {
                    updateInterfaceUsingData(data);
                } else {
                    // The 'error' keyword is here but inside a string
                    showError("An error occurred");
                }
            }
        });
        unfreezeInterface();
    }

    function onTabClick () {
        freezeInterface("Please wait, updating information...");
        $.ajax({
            url: "getInformation.aspx",
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "application/json");
            },
            dataType: 'json',
            minLength: 3,
            complete: function (data) {
                var resultCode = data.resultCode;
                if (resultCode === 0) {
                    updateInterfaceUsingData(data);
                } else {
                    // The 'error' keyword is here but inside a string
                    showError("An error occurred");
                }
            }
        });
    }

    document.getElementById("myButton")
        .addEventListener("click", onClick);

    document.getElementById("myTab")
        .addEventListener("click", onTabClick);

})();