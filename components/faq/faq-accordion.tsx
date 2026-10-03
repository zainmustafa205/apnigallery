"use client";

import { useState } from "react";
import { ChevronDown, Package, Wallet, Truck, RotateCcw, Palette } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    id: "ordering",
    label: "Ordering",
    icon: Package,
    questions: [
      {
        q: "Order kaise place karein?",
        a: "Product select karein, variant (size/color/material) choose karein, apna design upload ya customize karein, aur cart me add karein ya direct WhatsApp order kar dein.",
      },
      {
        q: "Kya main order place karne se pehle apna design dekh sakta hoon?",
        a: "Haan, Order Builder me live preview hoti hai jisse aap apna final design submit karne se pehle dekh sakte hain.",
      },
      {
        q: "Order place hone ke baad kya hota hai?",
        a: "Printing shuru karne se pehle hum aapse WhatsApp ya Call par design confirm karte hain, taake koi galti na ho.",
      },
      {
        q: "Bulk ya corporate order kaise karun?",
        a: "Bulk/Corporate Order page par apni requirement bata kar form submit karein, hamari team aapse khud rabta karegi.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment",
    icon: Wallet,
    questions: [
      {
        q: "Payment methods kya hain?",
        a: "Cash on Delivery (15–20% advance mandatory) ya Full Manual Transfer (JazzCash / Easypaisa / Bank Transfer).",
      },
      {
        q: "Advance payment kyun zaroori hai?",
        a: "Advance payment order ko confirm karne aur processing shuru karne ke liye liya jata hai, taake fake/ghost orders se bacha ja sake.",
      },
      {
        q: "Advance payment kaise submit karun?",
        a: "JazzCash/Easypaisa/Bank transfer karein, phir receipt ka screenshot website par upload karein ya WhatsApp par order ID ke sath bhej dein.",
      },
      {
        q: "Card/Wallet se payment available hai?",
        a: 'Ye feature jald hi aa raha hai — abhi "Coming Soon" hai.',
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    icon: Truck,
    questions: [
      {
        q: "Delivery mein kitna time lagta hai?",
        a: "Design confirm hone ke baad, order aam taur par kuch working days mein deliver ho jata hai — exact time order quantity par depend karta hai.",
      },
      {
        q: "Kya aap pure Pakistan mein deliver karte hain?",
        a: "Ji haan, hum Pakistan bhar mein COD delivery provide karte hain.",
      },
      {
        q: "Order track kaise karun?",
        a: "Track Order page par apna Tracking Code aur Phone Number dal kar order ki live status dekh sakte hain.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns",
    icon: RotateCcw,
    questions: [
      {
        q: "Kya main order cancel kar sakta hoon?",
        a: "Design confirm hone se pehle order cancel ho sakta hai. Confirm hone ke baad cancellation ke liye humse WhatsApp par rabta karein.",
      },
      {
        q: "Galat ya damaged product mile to kya karun?",
        a: "Turant humein WhatsApp par product ki tasveer ke sath bata dein — hum replacement ya refund ka intezam karenge.",
      },
      {
        q: "Custom printed items return ho sakte hain?",
        a: "Chunke har item aapki marzi se custom print hota hai, normal return sirf defect/damage ki surat mein hi applicable hai.",
      },
    ],
  },
  {
    id: "custom-design",
    label: "Custom Design",
    icon: Palette,
    questions: [
      {
        q: "Konsi file formats upload kar sakta hoon?",
        a: "Aam image formats (JPG, PNG) support karte hain — best print quality ke liye high-resolution image upload karein.",
      },
      {
        q: "Apna khud ka text ya font add kar sakta hoon?",
        a: "Haan, Order Builder mein text add karne ke options hain, sath hi font aur color choose karne ki bhi facility hai.",
      },
      {
        q: "Urdu text support hai?",
        a: "Ji haan, Urdu script wale fonts bhi available hain design ke liye.",
      },
      {
        q: "Design confirm hone ke baad change kar sakta hoon?",
        a: "Printing shuru hone se pehle hum WhatsApp/Call par confirm karte hain — us waqt tak changes mumkin hain.",
      },
    ],
  },
];

export default function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORIES[0].id);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const category = FAQ_CATEGORIES.find((c) => c.id === activeCategory)!;

  function handleCategoryChange(id: string) {
    setActiveCategory(id);
    setOpenIndex(0);
  }

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {FAQ_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "border-lavender bg-surface text-text-dark/70 hover:border-primary/40"
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Accordion */}
      <div className="bg-surface/45 mt-6 space-y-2 rounded-[1.75rem] border border-white/30 p-3 shadow-md backdrop-blur-xl sm:p-5">
        {category.questions.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={item.q}
              className="border-lavender bg-surface overflow-hidden rounded-xl border"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
              >
                <span className="text-text-dark text-sm font-medium sm:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  className={`text-primary h-5 w-5 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-text-dark/70 px-4 pb-4 text-sm leading-6 sm:px-5">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
