import Link from "next/link";
import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">人格实验室</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              通过科学的心理学测评工具，帮助你更好地了解自己，找到成长的方向。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">探索</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/test" className="text-sm text-muted hover:text-primary transition-colors">
                  开始测试
                </Link>
              </li>
              <li>
                <Link href="/types" className="text-sm text-muted hover:text-primary transition-colors">
                  人格类型
                </Link>
              </li>
              <li>
                <Link href="/books" className="text-sm text-muted hover:text-primary transition-colors">
                  书籍推荐
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">改善</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions" className="text-sm text-muted hover:text-primary transition-colors">
                  改善方案
                </Link>
              </li>
              <li>
                <Link href="/solutions/avoidant-plan" className="text-sm text-muted hover:text-primary transition-colors">
                  回避型改善
                </Link>
              </li>
              <li>
                <Link href="/solutions/borderline-plan" className="text-sm text-muted hover:text-primary transition-colors">
                  边缘型改善
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">声明</h4>
            <p className="text-xs text-muted leading-relaxed">
              本测试仅供自我探索和参考之用，不能替代专业心理诊断。如你有心理健康方面的困扰，请寻求专业心理咨询师的帮助。
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; {new Date().getFullYear()} 人格实验室 - 了解自己，是一生的功课
          </p>
        </div>
      </div>
    </footer>
  );
}
