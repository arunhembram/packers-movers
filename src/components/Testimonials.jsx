import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSection } from '../context/SectionContext.jsx';
import { Star } from 'lucide-react';
// translations come from context via LanguageProvider
import { useLanguage } from '../context/LanguageContext.jsx';

// Converted from user-provided code. No logic/animation changes.
// Only adjustment: inline CSS uses a standard <style> tag (compatible with Vite) instead of <style jsx>.

const Testimonials = ({ maxPerState = 3, id = 'testimonials', className = '' }) => {
  const { lang, translations } = useLanguage();
  const t = translations[lang] || translations.en;
  const reviewsData = t.reviews || translations.en.reviews;
  const headerTitle = t.testimonialsHeader || 'Customer Reviews';
  const sectionName = t.sections.testimonials || 'Reviews';
  const { setCurrentSection } = useSection();
  const sectionRef = useRef();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const scrollContainerRef = useRef(null);
  // maintain index to choose next review text sequentially
  const reviewTextIndexRef = useRef(0);
  const [visibleReviews, setVisibleReviews] = useState([]);
  const [usedNames, setUsedNames] = useState(new Set());
  const [stateCustomerCount, setStateCustomerCount] = useState(new Map());
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoScrollIntervalRef = useRef(null);

  /* ---------------------- CONSTANT DATA ---------------------- */
  const indianStates = [
    'West Bengal', 'Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat', 'Rajasthan',
    'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Assam', 'Kerala',
    'Haryana', 'Punjab', 'Jharkhand', 'Chhattisgarh', 'Himachal Pradesh',
    'Uttarakhand', 'Goa', 'Manipur', 'Meghalaya', 'Tripura', 'Nagaland',
    'Mizoram', 'Arunachal Pradesh', 'Sikkim', 'Andhra Pradesh', 'Telangana'
  ];

  const indianNames = {
    'West Bengal': ['Ananya Chatterjee', 'Rohit Banerjee', 'Priya Mukherjee', 'Arjun Das', 'Subrata Sen', 'Mallika Bose', 'Debashish Roy', 'Sharmila Ghosh'],
    'Maharashtra': ['Aditi Sharma', 'Vikram Patil', 'Sneha Deshmukh', 'Karan Joshi', 'Manasi Kulkarni', 'Nikhil Deshpande', 'Priyanka Bhosale', 'Sagar Wagh'],
    'Tamil Nadu': ['Kavitha Raman', 'Suresh Kumar', 'Deepika Nair', 'Rajesh Pillai', 'Lakshmi Subramanian', 'Arjun Krishnan', 'Meera Iyer', 'Vinod Chandra'],
    'Karnataka': ['Meera Reddy', 'Arun Gowda', 'Lakshmi Rao', 'Ganesh Murthy', 'Priya Hegde', 'Kiran Shetty', 'Divya Nayak', 'Mahesh Bhat'],
    'Gujarat': ['Ravi Patel', 'Nisha Shah', 'Harsh Modi', 'Priya Mehta', 'Kirti Desai', 'Jayesh Thakkar', 'Riddhi Parekh', 'Dhruv Amin'],
    'Rajasthan': ['Pooja Agarwal', 'Mahesh Sharma', 'Sunita Jain', 'Amit Gupta', 'Kavita Bhargava', 'Ravi Singhal', 'Neha Joshi', 'Prakash Soni'],
    'Uttar Pradesh': ['Shivani Verma', 'Rahul Singh', 'Anjali Gupta', 'Deepak Yadav', 'Priyanka Mishra', 'Ajay Tiwari', 'Ritu Agarwal', 'Manish Saxena'],
    'Madhya Pradesh': ['Manisha Tiwari', 'Sachin Chouhan', 'Ritu Jain', 'Prakash Sharma', 'Sunita Patel', 'Vikash Yadav', 'Kavita Rajput', 'Dinesh Soni'],
    'Bihar': ['Priyanka Kumar', 'Santosh Prasad', 'Kavita Singh', 'Manoj Thakur', 'Renu Devi', 'Sunil Jha', 'Anita Kumari', 'Rajesh Sinha'],
    'Odisha': ['Sanjana Panda', 'Bijay Nayak', 'Rashmi Sahoo', 'Debasis Mohanty', 'Priya Dash', 'Rakesh Biswal', 'Sunita Jena', 'Kartik Patnaik'],
    'Assam': ['Dipika Bora', 'Kamal Sarma', 'Ritu Gogoi', 'Pranab Das', 'Jyoti Deka', 'Himanta Saikia', 'Rubi Hazarika', 'Bishnu Talukdar'],
    'Kerala': ['Divya Nair', 'Arun Menon', 'Latha Krishnan', 'Sunil Pillai', 'Anjali Warrier', 'Rajesh Nambiar', 'Suma Raj', 'Vinod Thomas'],
    'Haryana': ['Neha Malik', 'Vikas Yadav', 'Pooja Sharma', 'Rohit Chaudhary', 'Sunita Hooda', 'Ajay Dalal', 'Ritu Bansal', 'Deepak Garg'],
    'Punjab': ['Simran Kaur', 'Jaspreet Singh', 'Manpreet Kaur', 'Gurpreet Singh', 'Harpreet Kaur', 'Navjot Singh', 'Rajinder Kaur', 'Balwinder Singh'],
    'Jharkhand': ['Anita Kumari', 'Ravi Oraon', 'Sunita Mahato', 'Deepak Sinha', 'Priya Tirkey', 'Sunil Toppo', 'Kavita Xess', 'Rajesh Kerketta'],
    'Chhattisgarh': ['Renu Sahu', 'Lokesh Verma', 'Kavita Patel', 'Suresh Yadav', 'Prabha Thakur', 'Dinesh Chandrakar', 'Sunita Bharti', 'Mahesh Jangde'],
    'Himachal Pradesh': ['Priyanka Thakur', 'Amit Chauhan', 'Nisha Sharma', 'Vikash Verma', 'Kavita Kumari', 'Rajesh Negi', 'Sunita Devi', 'Naresh Dogra'],
    'Uttarakhand': ['Meera Bisht', 'Rajesh Negi', 'Sunita Rawat', 'Anil Pandey', 'Priya Bhatt', 'Deepak Joshi', 'Ritu Semwal', 'Vikash Dobhal'],
    'Goa': ['Priya Fernandes', "Carlos D'Souza", 'Maria Pereira', 'Anthony Rodrigues', 'Sonia Dias', 'Xavier Lobo', 'Neha Rebello', 'Ryan Gomes'],
    'Manipur': ['Bina Devi', 'Tomba Singh', 'Sushma Devi', 'Raju Sharma', 'Ningol Devi', 'Th. Muivah', 'Chanu Devi', 'Ibomcha Singh'],
    'Meghalaya': ['Mary Lyngdoh', 'Peter Syiem', 'Rita Nonglait', 'John Marwein', 'Daisy Khonglah', 'Shillong Nongbri', 'Linda Warjri', 'Baptist Lamare'],
    'Tripura': ['Ruma Debbarma', 'Biplab Das', 'Sunita Reang', 'Pradip Chakraborty', 'Malati Tripura', 'Ratan Bhowmik', 'Kajal Jamatia', 'Sukanta Sarkar'],
    'Nagaland': ['Temsula Ao', 'Neikhu Konyak', 'Yangchen Lotha', 'Bendang Sema', 'Neilhou Kire', 'Pfucho Kikon', 'Arenla Subong', 'Kughalu Mulatonu'],
    'Mizoram': ['Lalnunmawii', 'Zoramthanga', 'Lalrinpuii', 'Vanlalhruaia', 'Lalhriatpuii', 'Lalduhawma', 'Lalmalsawmi', 'Vanlalruata'],
    'Arunachal Pradesh': ['Yani Tali', 'Kento Rina', 'Millo Tago', 'Nabam Tuki', 'Toko Sheetal', 'Joram Begi', 'Kaling Moyong', 'Nyali Losu'],
    'Sikkim': ['Pema Sherpa', 'Tenzing Bhutia', 'Doma Lepcha', 'Karma Gyatso', 'Tashi Namgyal', 'Yangchen Lhamo', 'Norbu Wangchuk', 'Dolma Sherpa'],
    'Andhra Pradesh': ['Lakshmi Devi', 'Ravi Chandra', 'Suma Reddy', 'Venkat Rao', 'Padma Kumari', 'Srinivas Naidu', 'Priya Devi', 'Ramesh Babu'],
    'Telangana': ['Swathi Reddy', 'Mahesh Goud', 'Priya Naidu', 'Kiran Kumar', 'Kavitha Rani', 'Rajesh Yadav', 'Sunita Devi', 'Venkat Reddy']
  };

  /* ---------------------- HELPER FUNCTIONS ---------------------- */

  const generateAvatar = (name) => {
    const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F'];
    const initials = name.split(' ').map(n=>n[0]).join('');
    return { initials, color: colors[name.length % colors.length] };
  };

  const getUniqueReviewData = useCallback((localUsedNames, localStateCount) => {
    const availableStates = indianStates.filter(state => (localStateCount.get(state)||0) < maxPerState);
    if (!availableStates.length) return null;

    let selectedState;
    if (reviews.length === 0 && availableStates.includes('West Bengal')) selectedState = 'West Bengal';
    else if (reviews.length >=1 && reviews.length < 10) {
      const other = availableStates.filter(s=>s!=='West Bengal');
      selectedState = other.length ? other[Math.floor(Math.random()*other.length)] : 'West Bengal';
    } else {
      selectedState = availableStates[Math.floor(Math.random()*availableStates.length)];
    }

    const availableNames = indianNames[selectedState].filter(n=>!localUsedNames.has(n));
    if (!availableNames.length) return null;
    const selectedName = availableNames[Math.floor(Math.random()*availableNames.length)];

    return { name: selectedName, state: selectedState };
  }, [reviews.length, maxPerState, lang]);

  const generateReviews = useCallback((pageNum) => {
    const startIndex = pageNum * 10;
    const newReviews = [];
    const localUsedNames = new Set(usedNames);
    const localStateCount = new Map(stateCustomerCount);

    for (let i=0;i<10;i++) {
      const uniqueData = getUniqueReviewData(localUsedNames, localStateCount);
      if (!uniqueData) break;
      const review = {
        id: startIndex+i,
        name: uniqueData.name,
        state: uniqueData.state,
        rating: uniqueData.state==='West Bengal'?5:(Math.random()>0.3?5:4.5),
        text: (()=>{ const txt = reviewsData[reviewTextIndexRef.current % reviewsData.length].text; reviewTextIndexRef.current++; return txt;})(),
        date: new Date(Date.now()-Math.random()*365*24*60*60*1000).toLocaleDateString('en-IN'),
        avatar: generateAvatar(uniqueData.name)
      };
      localUsedNames.add(uniqueData.name);
      localStateCount.set(uniqueData.state,(localStateCount.get(uniqueData.state)||0)+1);
      newReviews.push(review);
    }
    setUsedNames(localUsedNames);
    setStateCustomerCount(localStateCount);
    return newReviews;
  }, [usedNames, stateCustomerCount, getUniqueReviewData, reviewsData]);

  const loadMoreReviews = useCallback(() => {
    if (loading) return;
    setLoading(true);
    const newReviews = generateReviews(page);
    if (!newReviews.length) { setLoading(false); return; }
    setReviews(prev=>[...prev,...newReviews]);
    setPage(prev=>prev+1);
    setLoading(false);
  }, [page, loading, generateReviews, lang]);

  /* ---------------------- AUTO SCROLL ---------------------- */

  const startAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    autoScrollIntervalRef.current = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container || !isAutoScrolling) return;
      const scrollStep = 2;
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (container.scrollTop >= maxScroll) container.scrollTop = 0; else container.scrollTop += scrollStep;
    }, 30);
  }, [isAutoScrolling]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current);
    setIsAutoScrolling(false);
    setUserInteracted(true);
  }, []);

  const handleUserInteraction = useCallback(() => stopAutoScroll(), [stopAutoScroll]);

  /* ---------------------- EFFECTS ---------------------- */

  useEffect(() => { setTimeout(()=>loadMoreReviews(),100); }, []);

  // Reset reviews when language changes to show localized texts
  useEffect(() => {
    // clear current data
    setReviews([]);
    setUsedNames(new Set());
    setStateCustomerCount(new Map());
    setPage(0);
    reviewTextIndexRef.current = 0;
    // Load initial reviews for new language
    setTimeout(()=>loadMoreReviews(), 50);
  }, [lang]);

  useEffect(() => {
    if (reviews.length && isAutoScrolling && !userInteracted) startAutoScroll();
    return () => { if (autoScrollIntervalRef.current) clearInterval(autoScrollIntervalRef.current); };
  }, [reviews, isAutoScrolling, userInteracted, startAutoScroll]);

  /* ---------------------- VIRTUALISATION ---------------------- */

  const updateVisibleReviews = useCallback(() => {
    const container = scrollContainerRef.current; if (!container) return;
    const { scrollTop, clientHeight } = container;
    const itemHeight = 200; const buffer = 200;
    const startIndex = Math.max(0, Math.floor((scrollTop-buffer)/itemHeight));
    const endIndex = Math.min(reviews.length, Math.ceil((scrollTop+clientHeight+buffer)/itemHeight));
    const visible = reviews.slice(startIndex,endIndex).map((review, idx)=>({ ...review, index:startIndex+idx, top:(startIndex+idx)*itemHeight }));
    setVisibleReviews(visible);
  }, [reviews]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current; if (!container) return;
    updateVisibleReviews();
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight * 0.8) loadMoreReviews();
  }, [updateVisibleReviews, loadMoreReviews]);

  useEffect(()=>{ updateVisibleReviews(); }, [reviews, updateVisibleReviews]);

  /* ---------------------- STAR SUB COMPONENTS ---------------------- */

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(star=> (
        <Star key={star} size={16} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );

  const OverallStarRating = ({ rating }) => {
    const full = Math.floor(rating);
    const partialFill = rating % 1;
    return (
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(star=>{
          if (star <= full) return <Star key={star} size={20} className="fill-yellow-400 text-yellow-400" />;
          if (star===full+1 && partialFill) {
            const uid = `partial-${star}`;
            return (
              <div key={uid} className="relative">
                <div className="absolute overflow-hidden" style={{width:`${partialFill*100}%`}}>
                  <Star size={20} className="fill-yellow-400 text-yellow-400" />
                </div>
                <Star size={20} className="text-gray-300" />
              </div>
            );
          }
          return <Star key={star} size={20} className="text-gray-300" />;
        })}
      </div>
    );
  };

  const ReviewItem = ({ review, style }) => (
    <div className="absolute w-full" style={style}>
      <div className="flex flex-col items-center text-center p-4 bg-white/80 backdrop-blur-sm min-h-[180px] border-t border-white/30">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-3" style={{backgroundColor: review.avatar.color}}>
          {review.avatar.initials}
        </div>
        <div className="w-full flex-1">
          <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
            <span className="text-sm font-medium text-gray-900">{review.name}</span>
            <span className="text-xs text-gray-500">• {review.state}</span>
          </div>
          <div className="flex justify-center mb-3"><StarRating rating={review.rating} /></div>
          <div className="px-2 mb-4"><p className="text-sm text-gray-700 leading-relaxed text-center break-words">{review.text}</p></div>
        </div>
      </div>
    </div>
  );

  /* ---------------------- OBSERVE SECTION VISIBILITY ---------------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCurrentSection(sectionName);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [setCurrentSection]);

  /* ---------------------- RENDER ---------------------- */

  return (
    <div id={id} ref={sectionRef} className={`w-full max-w-4xl mx-auto px-4 pt-4 pb-12 lg:pb-20 mt-10 lg:mt-16 bg-gradient-to-r from-emerald-100 via-teal-200 to-emerald-200 rounded-xl shadow-lg ${className}`}>
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{headerTitle}</h2>
        <div className="flex items-center justify-center gap-2">
          <OverallStarRating rating={4.8} />
          <span className="text-lg font-semibold text-gray-900">4.8</span>
          <span className="text-sm text-gray-500">out of 5</span>
        </div>
        {userInteracted && (<div className="mt-2 text-xs text-gray-500">{t.reviewsNote}</div>) }
        {!userInteracted && reviews.length > 0 && (<div className="mt-2 text-xs text-green-600">Auto-scrolling active - click or scroll to take control</div>) }
      </div>

      <div className="relative w-full bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden" style={{height:'300px'}}>
        <div ref={scrollContainerRef} className="h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 scrollbar-thumb-rounded" onScroll={handleScroll} onMouseDown={handleUserInteraction} onTouchStart={handleUserInteraction} onWheel={handleUserInteraction}>
          <div className="relative" style={{height:`${reviews.length*200}px`}}>
            {visibleReviews.map(review=> (
              <ReviewItem key={review.id} review={review} style={{top:`${review.top}px`,height:'200px'}} />
            ))}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styling */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-track-gray-100::-webkit-scrollbar-track { background-color: #f3f4f6; border-radius: 3px; }
        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb { background-color: #9ca3af; border-radius: 3px; }
        .scrollbar-thumb-rounded::-webkit-scrollbar-thumb:hover { background-color: #6b7280; }
      `}</style>
    </div>
  );
};

export default Testimonials;
