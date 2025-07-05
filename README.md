# Business Website

একটি মাল্টিল্যাঙ্গুয়াল (বাংলা/ইংরেজি) রিঅ্যাক্ট (Vite) ভিত্তিক বিজনেস ওয়েবসাইট। টেইলউইন্ড CSS ও কাস্টম কম্পোনেন্ট ব্যবহার করে সম্পূর্ণ রেসপনসিভ ডিজাইন করা হয়েছে।

## 🚀 ফিচারসমূহ

- 🔄 ভাষা পরিবর্তন (Language Gate ও `useLanguage` হুক)
- 🕒 কাউন্টডাউন ও হিরো সেকশন
- 📱 মোবাইল-ফ্রেন্ডলি রেসপনসিভ লেআউট
- 🌐 সহজ Vercel ডিপ্লয়মেন্ট

## 🛠️ শুরু করার নিয়ম

```bash
# ক্লোন করুন
git clone https://github.com/<your-username>/business-website.git
cd business-website

# প্যাকেজ ইন্সটল করুন
npm install

# ডেভেলপমেন্ট সার্ভার চালু করুন
npm run dev
# ব্রাউজার খুলুন: http://localhost:5173 (বা CLI-তে দেখানো পোর্ট)
```

## 🔨 প্রোডাকশন বিল্ড

```bash
npm run build
```
আউটপুট `dist/` ফোল্ডারে থাকবে, যা Vercel বা অন্য কোথাও সার্ভ করতে পারবেন।

## ☁️ Vercel-এ ডিপ্লয়

1. Vercel অ্যাকাউন্ট তৈরি করুন → https://vercel.com
2. GitHub-এর সঙ্গে Vercel যুক্ত করুন ও এই রিপো ইমপোর্ট করুন
3. ডিফল্ট সেটিংস রেখে **Deploy** চাপুন
4. কয়েক সেকেন্ডেই লাইভ URL পাবেন, উদাহরণ: `https://business-website.vercel.app`

## 📁 প্রোজেক্ট স্ট্রাকচার (সংক্ষেপে)

```
├─ src/
│  ├─ components/      # পুনঃব্যবহারযোগ্য রিঅ্যাক্ট কম্পোনেন্ট
│  ├─ context/         # React Context (Language, Section ইত্যাদি)
│  ├─ i18n/            # ট্রান্সলেশন ফাইল
│  ├─ assets/          # ছবি ও অন্যান্য অ্যাসেট
│  ├─ index.jsx        # এন্ট্রি পয়েন্ট
│  └─ …
├─ public/             # স্ট্যাটিক ফাইল
├─ vite.config.js      # Vite কনফিগ
└─ tailwind.config.js  # টেইলউইন্ড কনফিগ
```

## 🤝 কন্ট্রিবিউট

Pull Request স্বাগত! কোনো বাগ বা ফিচার রিকোয়েস্ট থাকলে Issue খুলুন।

## 📝 লাইসেন্স

MIT
