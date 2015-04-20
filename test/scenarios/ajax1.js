(function () {
    "use strict";

    /*global $, freezeInterface, updateInterfaceUsingData, unfreezeInterface*/
    /*global showError*/

    function onClick () {
        freezeInterface("Please wait, updating information...");
        $.ajax("getInformation.aspx", {
            success: function (data) {  // error -> Here the keyword should be complete | error
                var resultCode = data.resultCode;
                if (resultCode === 0) {
                    updateInterfaceUsingData(data);
                } else {
                    // The 'error' keyword is here but inside a string
                    showError("An error occurred");
                }
            }
        });
        unfreezeInterface();    // warning -> This function call shouldn't be here, due to the ajax async call.
    }

    document.getElementById("myButton")
        .addEventListener("click", onClick);

})();