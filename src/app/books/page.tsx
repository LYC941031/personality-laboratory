"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { BookCard } from "@/components/mdx/book-card";
import { books } from "@/../data/books";
import { personalityTypes } from "@/../data/personalities";
import { Filter } from "lucide-react";

export default function BooksPage() {
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredBooks = filterType
    ? books.filter((b) => b.relatedTypes.includes(filterType))
    : books;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <FadeIn>
        <SectionHeading
          pretitle="Books"
          title="心理学书籍推荐"
          description="精选与各人格类型相关的优质心理学读物"
          className="mb-12"
        />
      </FadeIn>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <div className="flex items-center gap-2 text-sm text-muted mr-2">
          <Filter className="w-4 h-4" />
          按人格类型筛选：
        </div>
        <button
          onClick={() => setFilterType(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            filterType === null
              ? "bg-primary text-white"
              : "bg-gray-100 text-muted hover:bg-gray-200"
          }`}
        >
          全部
        </button>
        {personalityTypes.map((type) => (
          <button
            key={type.slug}
            onClick={() => setFilterType(type.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterType === type.slug
                ? "text-white"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
            style={
              filterType === type.slug
                ? { backgroundColor: type.color }
                : undefined
            }
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredBooks.map((book, i) => (
          <motion.div
            key={book.slug}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <BookCard book={book} />
          </motion.div>
        ))}
      </motion.div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted">该类型暂无相关书籍推荐</p>
        </div>
      )}
    </div>
  );
}
