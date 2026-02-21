export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
      <div className="w-full max-w-md mx-auto p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">
            生き甲斐
          </h1>
          <p className="text-sm text-[#6B6B80]">
            AI不動産アドバイザープラットフォーム
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E0E0E8] p-6">
          <h2 className="text-xl font-semibold text-[#1A1A2E] mb-6">
            新規登録
          </h2>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#2D2D44] mb-1"
              >
                お名前
              </label>
              <input
                id="name"
                type="text"
                placeholder="田中 太郎"
                className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D5A80] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#2D2D44] mb-1"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D5A80] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#2D2D44] mb-1"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                placeholder="8文字以上"
                className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3D5A80] focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-[#2D2D44] mb-1"
              >
                言語設定
              </label>
              <select
                id="language"
                className="w-full rounded-md border border-[#E0E0E8] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#3D5A80]"
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#3D5A80] text-white rounded-md py-2.5 text-sm font-medium hover:bg-[#2C4A6E] transition-colors"
            >
              アカウント作成
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B6B80]">
            すでにアカウントをお持ちの方は{" "}
            <a
              href="/sign-in"
              className="text-[#3D5A80] font-medium hover:underline"
            >
              ログイン
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
