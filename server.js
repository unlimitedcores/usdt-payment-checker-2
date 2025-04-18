const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

// ملفات ثابتة من مجلد public
app.use(express.static(path.join(__dirname, "public")));

app.get("/verify", async (req, res) => {
  const txid = req.query.txid;
  const wallet = "TT9nRLf2ZjgN956HmF77vCiqg2g3Qbg2tj";

  try {
    const response = await fetch(`https://apilist.tronscan.org/api/transaction-info?hash=${txid}`);
    const data = await response.json();

    const transfer = data?.contractData;
    const amount = parseInt(transfer?.amountStr) / 1_000_000;
    const toAddress = transfer?.to_address;

    if (toAddress === wallet && amount >= 9.99) {
      res.sendFile(path.join(__dirname, "public", "verify.html"));
    } else {
      res.send("❌ المعاملة غير صحيحة أو لم يتم إرسال 9.99 USDT إلى العنوان المطلوب.");
    }
  } catch (error) {
    res.send("⚠️ حدث خطأ أثناء التحقق من المعاملة.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});