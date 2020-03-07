const AsyncStorage = {
  getItem: function(key, defaultValue) {
    const value = localStorage.getItem(key);
    return (value !== null) ? JSON.parse(value).data : defaultValue;
  },
  setItem: function(key, value) {
    localStorage.setItem(key, JSON.stringify({ data: value }));
  },
}

export const CategoryName = (category) => {
  const cat = {
    Assets: '資産',
    Liabilities: '負債',
    Expenses: '費用',
    Income: '収益',
    Equity: '資本',
  }
  return cat[category];
}

export const addDealData = async (deal, callback) => {
  const data = await AsyncStorage.getItem("walletAccountData", [])
  const date = new Date();
  console.log(deal);
  data.push({
    date: date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate(),
    debit: CategoryName(deal.debit.category)+':'+deal.debit.name,
    credit: CategoryName(deal.credit.category)+':'+deal.credit.name,
    value: deal.value,
    comment: deal.comment,
  })
  await AsyncStorage.setItem("walletAccountData", data);
  callback();
}

export const loadAccountData = async (filter, callback) => {
  callback(await AsyncStorage.getItem("walletAccountData", []));
}

export const loadCategoryData = (category, callback) => {
  const table = {
    Assets: [
      "現金",
      "預金",
      "電子マネー",
      "資産",
    ],
    Liabilities: [
      "カード",
      "負債",
    ],
    Equity: [
      "資本",
    ],
    Income: [
      "給与",
      "収益",
    ],
    Expenses: [
      "食費",
      "消耗品",
      "新聞図書",
      "交通費",
      "散髪",
      "衣類",
      "費用",
    ],
  }
  callback(table[category]);
}
