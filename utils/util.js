const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const toChineseWords = (data) => {
  if (data == '' || typeof data == 'undefined') return '请输入十六进制unicode';
  data = data.split("\\u");
  let text = '';
  for (let i = 0; i < data.length; i++) {
    text += String.fromCharCode(parseInt(data[i], 16).toString(10));
  }
  return text;
}

module.exports = {
  formatTime: formatTime,
  toChineseWords: toChineseWords
}
