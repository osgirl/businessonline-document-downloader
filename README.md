# businessonline-document-downloader
Greasemonkey script that downloads invoces from businessonline.ge (Bank of Georgia's Internet Banking )


You should only create Json array withe the following  information: Account number, date ,persona number. This information is mandatory in order to find document.

Json looks like this:
```
[
        {
            "accountNumber": "GE35BG0000000000000001",
            "dateFrom": "30/01/2015",
            "dateTo": "30/12/2015",
            "personalId": "00000000001"
        },
        {
            "accountNumber": "GE35BG0000000000000002",
            "dateFrom": "21/08/2016",
            "dateTo": "21/08/2016",
            "personalId": "00000000002"
       }
];
```

Usage:

* Install gracemonkey into the firefox with [the following link](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
* Add the businessonline-downloader.js
* In gracemonkey configuration tab add  the following [download page url](https://businessonline.ge/Pages/Transactions/View/NationalTransferOut.aspx)
* Create json array and add it to the the variable named infoArray
* enter to the downloader page and invoice downloading will be started automatically
* Wait and have a fun untill all the pdf document will be downloaded!
