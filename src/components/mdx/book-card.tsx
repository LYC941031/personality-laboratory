import Link from "next/link";
import { Book } from "@/../data/books";
import { ExternalLink } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-300 group"
    >
      <div
        className="w-full h-2 rounded-full mb-4"
        style={{ backgroundColor: book.coverColor }}
      />

      <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
        {book.title}
      </h4>
      <p className="text-xs text-muted mb-3">{book.author}</p>

      <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-3">
        {book.summary}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {book.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {book.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
          >
            {link.label}
            <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
