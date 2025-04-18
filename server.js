
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/verify', async (req, res) => {
  const txid = req.query.txid;
  if (!txid) return res.send('لم يتم توفير TXID');

  try {
    const response = await axios.get(`https://apilist.tronscanapi.com/api/transaction-info?hash=${txid}`);
    const data = response.data;

    if (
      data &&
      data.contractData &&
      data.contractData.amount === 9990000 &&
      data.contractData.to_address === 'TT9nRLf2ZjgN956HmF77vCiqg2g3Qbg2tj'
    ) {
      res.send('<h2>✅ تم الدفع بنجاح!</h2><a href="/Old-Money-Guide.pdf" download>تحميل المنتج</a>');
    } else {
      res.send('<h2>❌ لم يتم العثور على معاملة مطابقة.</h2>');
    }
  } catch (error) {
    res.send('<h2>⚠️ حدث خطأ أثناء التحقق من المعاملة.</h2>');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
