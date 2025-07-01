"use client"
import React, { useState } from "react";
import { EDUCATION_ARTICLES, ICONS } from "@/constants";

interface EducationArticle {
  title: string;
  content: string;
}

const Education: React.FC = () => {
  const [selectedArticle, setSelectedArticle] =
    useState<EducationArticle | null>(null);

  const ArticleModal = () => {
    if (!selectedArticle) return null;
    return (
      <div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedArticle(null)}
      >
        <div
          className="bg-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-teal-400">
              {selectedArticle.title}
            </h2>
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-slate-400 hover:text-white"
            >
              {ICONS.close}
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed whitespace-pre-line">
            {selectedArticle.content}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <ArticleModal />
      <h1 className="text-3xl font-bold text-slate-100">Conoce a tu Enemigo</h1>
      <p className="text-slate-400">
        El conocimiento es poder. Entender cómo funciona la adicción te da una
        ventaja para superarla.
      </p>

      <div className="space-y-4">
        {EDUCATION_ARTICLES.map((article, index) => (
          <div
            key={index}
            className="bg-slate-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-slate-700 transition"
            onClick={() => setSelectedArticle(article)}
          >
            <h3 className="text-lg font-semibold text-teal-400">
              {article.title}
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              {article.content.substring(0, 100)}...
            </p>
            <p className="text-teal-500 text-sm font-semibold mt-2">Leer más</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
