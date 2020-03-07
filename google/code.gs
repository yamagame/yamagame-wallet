var cat = {
  Assets: '資産',
  Liabilities: '負債',
  Expenses: '費用',
  Income: '収益',
  Equity: '資本',
}

//<link rel="apple-touch-icon" href="https://drive.google.com/open?id=1x2H0zgYbw8xMqokj4qCJBbE4QVwVTVIo" />

function doGet() {
  const output = HtmlService.createTemplateFromFile('react-index').evaluate();
  output.setFaviconUrl('https://drive.google.com/uc?authuser=0&id=1x2H0zgYbw8xMqokj4qCJBbE4QVwVTVIo&export=download&dummy.png');
  return output;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function addDealData(deal) {
  var date = new Date();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(date.getFullYear().toString());
  if (sheet == null) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(date.getFullYear().toString());
  }
  if (sheet) {
    var rows = sheet.getLastRow();
    var cols = sheet.getLastColumn();
    var rg = sheet.getDataRange();
    sheet.getRange(rows+1, 1).setValue(date)
    sheet.getRange(rows+1, 2).setValue(deal.value)
    sheet.getRange(rows+1, 3).setValue(cat[deal.debit.category]+':'+deal.debit.name)
    sheet.getRange(rows+1, 4).setValue(cat[deal.credit.category]+':'+deal.credit.name)
    sheet.getRange(rows+1, 5).setValue(deal.comment)
  }
}

function getAccountItems(category) {
  var name = cat[category];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('科目');
  var range = sheet.getDataRange();
  var data = sheet.getRange('1:1').getValues();
  var r = []
  if (data.length > 0) {
    for (var i=0;i<data[0].length;i++) {
      if (data[0][i] == name) {
        var cols = sheet.getRange(1, i+1, range.getLastRow(), 1).getValues();
        for (var j=0;j<cols.length;j++) {
          if (cols[j][0] !== '') {
            r.push(cols[j][0]);
          }
        }
      }
    }
  }
  return r;
}

function testFunc() {
  var filter = { year: 2018, month: 1 };
  var r = getMonthlyItems(filter);
  Logger.log(r);
}

function getMonthlyItems(filter) {
  var r = [];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('集計');
  if (sheet !== null) {
    var range = sheet.getRange('A1:A1');
    range.setFormula("=QUERY('"+filter.year.toString()+"'!A:E,\"Select * where MONTH(A)+1 = "+filter.month.toString()+" and YEAR(A) = "+filter.year.toString()+" order by A desc\")")
    var data = sheet.getDataRange().getValues();
    for (var y=0;y<data.length;y++) {
      if (typeof data[y][0] === 'object') {
        var q = {
          date: data[y][0],
          value: data[y][1],
          debit: data[y][2],
          credit: data[y][3],
        };
        q.day = ('00'+q.date.getDate()).slice(-2);
        q.date = q.date.getFullYear()+"/"+(q.date.getMonth()+1)+"/"+q.date.getDate();
        r.push(q);
      }
    }
  }
  return r;
}
