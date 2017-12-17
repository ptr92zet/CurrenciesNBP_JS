(function () {
    'use strict';

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel;
    var selectYearList;
    var selectDateList;
    var progressBar;
    var templateTable;
    var ratingEntriesTable;
    var currencyTemplate;
    var ratingsData;

    var codes = [];
    var names = [];
    var ratings = [];

    var years = [];
    var currentYear = (new Date()).getFullYear();
    var initialYear = 2002;

    WinJS.UI.Pages.define("default.html", {

        ready: function () {
            console.log("St-arting");
            console.log("Loading document elements");
            this.initDocumentElements();
            console.log("Loaded document elements");
            console.log("Initializing years");
            this.initYears();
            console.log("Initialized years");
        },

        initDocumentElements: function () {
            progressBar = document.getElementById("progressBar");
            templateTable = document.getElementById("templateTable");
            selectYearList = document.getElementById("selectYear");
            selectDateList = document.getElementById("selectDate");
            ratingEntriesTable = document.getElementById("ratingEntries");
            currencyTemplate = document.getElementById("currencyTemplate");
        },

        initYears: function () {
            progressBar.style.visibility = "visible";
            templateTable.style.visibility = "hidden";

            var year = initialYear;
            var yearDiff = currentYear - initialYear;
            for (var i = 0; i <= yearDiff; i++) {
                years[i] = year + i;
            }
            years.reverse();

            for (var i = 0; i < years.length; i++) {
                var option = document.createElement("option");
                option.text = years[i];
                option.value = years[i];
                selectYearList.appendChild(option);
            }

            selectYearList.onchange = getDates;

            progressBar.style.visibility = "hidden";
        },
    })
    
    function getDates() {

    }

}());
