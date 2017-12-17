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
    var ratingsData = [];

    var years = [];
    var currentYear = (new Date()).getFullYear();
    var initialYear = 2002;

    var dateFiles = [];
    var dates = [];

    var codes = [];
    var names = [];
    var ratings = [];

    WinJS.UI.Pages.define("default.html", {

        ready: function () {
            this.initDocumentElements();
            this.initYears();
        },

        // init global variables 
        initDocumentElements: function () {
            progressBar = document.getElementById("progressBar");
            templateTable = document.getElementById("templateTable");
            selectYearList = document.getElementById("selectYear");
            selectDateList = document.getElementById("selectDate");
            ratingEntriesTable = document.getElementById("ratingEntries");
        },

        // load available years after application starts
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

            selectYearList.onchange = this.yearSelected;
            progressBar.style.visibility = "hidden";
        },

        // year selected
        yearSelected: function () {
            progressBar.style.visibility = "visible";
            ratingsData.length = 0;
            var rows = ratingEntriesTable.getElementsByTagName('tr');
            var rowsCount = rows.length;

            for (var i = rowsCount - 1; i >= 0; i--) {
                ratingEntriesTable.removeChild(rows[i]);
            }
            selectDateList.length = 0;

            var selectedYear = selectYearList.value;
            var httpRequest = new XMLHttpRequest();

            if (selectedYear == currentYear) {
                httpRequest.open("GET", 'http://www.nbp.pl/kursy/xml/dir.txt');
            }
            else {
                httpRequest.open("GET", 'http://www.nbp.pl/kursy/xml/dir' + selectedYear + '.txt');
            }

            // populating selectDateList with files from selected year
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState == 4) {
                    dates = [];
                    dateFiles = [];
                    
                    var response = httpRequest.responseText;
                    var processedResponse = response.split("\n");
                    for (var i = 0; i < processedResponse.length - 1; i++) {
                        if (!(processedResponse[i].substring(0, 1) === "a")) {
                            continue;
                        }
                        var dateStr = "20" + processedResponse[i].substring(5, 7) + "-" + processedResponse[i].substring(7, 9) + "-" + processedResponse[i].substring(9, 11);
                        dates[dates.length] = dateStr;
                        dateFiles[dateFiles.length] = processedResponse[i];
                    }

                    for (var i = 0; i < dates.length; i++) {
                        var option = document.createElement("option");
                        option.text = dates[i];
                        option.value = dates[i];
                        selectDateList.appendChild(option);
                    }
                    progressBar.style.visibility = "hidden";

                    // single date selected
                    selectDateList.onchange = function () {
                        progressBar.style.visibility = "visible";
                        var index = selectDateList.selectedIndex;
                        var selectedDate = selectDateList.value;
                        var dateFile = dateFiles[index];
                        var dat = dates[index];
                        document.getElementById("selectedDateText").textContent = "Ratings from selected date: " + selectedDate;
                        console.log("Selected date: " + selectedDate + ", index: " + index + ", datesIndex: " + dat + ", dateFilesIndex: " + dateFile);
                        var xmlRequest = new XMLHttpRequest();
                        var url = 'http://api.nbp.pl/api/exchangerates/tables/a/' + selectedDate + '?format=xml';
                        console.log("URL: " + url);
                        xmlRequest.open("GET", url);

                        // download currency ratings from selected date
                        xmlRequest.onreadystatechange = function () {
                            if (xmlRequest.readyState == 4) {
                                var xml = xmlRequest.responseXML;
                                var rateElements = xml.getElementsByTagName("Rate");
                                for (var i = 0; i < rateElements.length; i++) {
                                    codes[i] = rateElements[i].getElementsByTagName("Code")[0].childNodes[0].nodeValue;
                                    names[i] = rateElements[i].getElementsByTagName("Currency")[0].childNodes[0].nodeValue;
                                    ratings[i] = rateElements[i].getElementsByTagName("Mid")[0].childNodes[0].nodeValue;
                                }

                                // display currency ratings with the template table
                                
                                ratingsData.length = 0;
                                var rows = ratingEntriesTable.getElementsByTagName('tr');
                                var rowsCount = rows.length;

                                for (var i = rowsCount - 1; i >= 0; i--) {
                                    ratingEntriesTable.removeChild(rows[i]);
                                }

                                var templateControl = document.getElementById("currencyTemplate").winControl;
                                for (var i = 0; i < codes.length; i++) {
                                    ratingsData.push({ code: codes[i], name: names[i], rating: ratings[i] });
                                }
                                ratingsData.forEach(function (rating) {
                                    templateControl.render(rating, ratingEntriesTable);
                                })
                                templateTable.style.visibility = "visible";
                                progressBar.style.visibility = "hidden";
                            }
                        }
                        xmlRequest.send();
                    }
                }
            }
            httpRequest.send();
        },
    });

}());
