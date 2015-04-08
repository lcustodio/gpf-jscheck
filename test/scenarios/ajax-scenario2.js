(function () {
    "use strict";

    /*global $, freezeInterface, updateInterfaceUsingData, unfreezeInterface*/
    /*global showError*/

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
    }

    document.getElementById("myTab")
        .addEventListener("click", onTabClick);

})();