import Link from "next/link";
import { Brain } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">
            人格实验室
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/test"
            className="text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            开始测试
          </Link>
          <Link
            href="/types"
            className="text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            人格类型
          </Link>
          <Link
            href="/solutions"
            className="text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            改善方案
          </Link>
          <Link
            href="/books"
            className="text-sm font-medium text-muted hover:text-primary transition-colors"
          >
            书籍推荐
          </Link>
        </nav>

        <Link
          href="/test"
          className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:shadow-primary/25"
        >
          免费测试
        </Link>

        {/* Mobile nav can be added here */}
      </div>
    </header>
  );
}
