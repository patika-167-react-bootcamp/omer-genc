const list = ["Ömer", "genç", 1, { selam: 1 }];

Array.prototype.includesCI = function (item) {
  if (this.includes(item)) return true;

  if (!(typeof item === "string")) return false;
  
  const stringThis = JSON.stringify(this).toLocaleLowerCase();
  return JSON.parse(stringThis).includes(item.toLocaleLowerCase());
};


