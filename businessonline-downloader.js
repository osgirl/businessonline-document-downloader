// ==UserScript==
// @name        Businessonline Downloader
// @namespace   Downloaders
// @include     https://businessonline.ge/Pages/Transactions/View/NationalTransferOut.aspx
// @require     https://raw.githubusercontent.com/cowboy/jquery-throttle-debounce/v1.1/jquery.ba-throttle-debounce.js
// @version     1
// @grant       none
// ==/UserScript==
(function() {

    // we must assign json to this variable. The json data that should be downloaded by the script.
    var infoArray = [{
            "accountNumber": "GE35BG0000000000000001",
            "dateFrom": "30/01/2015",
            "dateTo": "30/12/2015",
            "personalId": "00000000001"
        },
        {
            "accountNumber": "GE35BG0000000000000001",
            "dateFrom": "21/08/2015",
            "dateTo": "21/08/2015",
            "personalId": "00000000002"
        }
    ];

    var i = -1;
    var timeout;
    var buttonClicked = false;
    var listItemsCheckboxWasClicked = false;
    var searchButtonId = '#ContentPlaceHolderMain_AboveList_Filter_ButtonFilter';
    var listItemsCheckboxHolderId = '#ContentPlaceHolderMain_RepeaterList_CheckAll';
    var downloadLinkHolderId = '#ContentPlaceHolderMain_LinkButtonPrintBottom';

    window.addEventListener('load', function() {
        $(searchButtonId).live('click', function(e) {
            buttonClicked = true;
        });
        $(listItemsCheckboxHolderId).live('change', function(e) {
            listItemsCheckboxWasClicked = true;
        });
        document.addEventListener('xhrResponse', function(r) {
            combinedExecution();
        }, false);
        nextItemDownload();
    }, false);


    function nextItemDownload() {
        i++;
        if (i < infoArray.length) {
            setParams(infoArray[i]);
            $(searchButtonId).get(0).click();
            console.log('Iteration: ', i);
        } else {
            $(searchButtonId).die();
            $(listItemsCheckboxHolderId).die();
            $(downloadLinkHolderId).die();
            console.log('Done');
        }
    }

    function combinedExecution() {
        if (buttonClicked) {
            buttonWasClickedAndResponseReturned();
            buttonClicked = false;
        } else if (listItemsCheckboxWasClicked) {
            listItemsCheckboxWasClickedAndResponseReturned();
            listItemsCheckboxWasClicked = false;
        } else {
            console.error('misfire!');
        }
    }

    function buttonWasClickedAndResponseReturned() {
        if ($('#ContentPlaceHolderMain_RepeaterList_CheckAll').get(0) != undefined) {
            console.log('downloading: ', infoArray[i].accountNumber);
            $(listItemsCheckboxHolderId).get(0).click();
        } else {
            console.log('can not download: ' + infoArray[i].accountNumber + " skip!");
            timeout = setTimeout(nextItemDownload, 10);
        }

    }

    function listItemsCheckboxWasClickedAndResponseReturned() {

        $(downloadLinkHolderId).get(0).click();
        timeout = setTimeout(nextItemDownload, 10);
    }

    function setParams(inf) {
        document.getElementById('ContentPlaceHolderMain_AboveList_Filter_TextBoxBenefAccount').value = inf.accountNumber;
        document.getElementsByName('ctl00$ctl00$ContentPlaceHolderMain$AboveList$Filter$DropDownListSenderAccount')[0].value = '${SENDER_ACCOUT_ID}';
        document.getElementById('ContentPlaceHolderMain_AboveList_Filter_TextBoxDateFrom').value = inf.dateFrom;
        document.getElementById('ContentPlaceHolderMain_AboveList_Filter_TextBoxDateTo').value = inf.dateTo;
    }

    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var response = this;
        response.addEventListener('load', function() {
            var event = new CustomEvent('xhrResponse', {
                'response': response
            });
            document.dispatchEvent(event);
        });
        origOpen.apply(this, arguments);
    };
})();
