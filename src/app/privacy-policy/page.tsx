import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
};

export default function PrivacyPolicy() {
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1 className="text-center">プライバシーポリシー</h1>
      <p className="text-right">2024 年 9 月 4 日</p>
      <ol>
        <li>
          当サイトはユーザーがログインに使用した Google または Discord
          アカウントに登録されているメールアドレス、表示名（名前）、アイコン画像
          URL を取得し、当サイトのユーザー情報としてデータベースに保存します
        </li>
        <li>
          当サイトはユーザーのログイン状態を管理するために Cookie
          を使用しています
        </li>
        <li>
          当サイトが保有する個人情報などのデータは、当サイトのサービス提供以外の目的では使用しません
        </li>
        <li>
          当サイトが保有する個人情報などのデータを、ユーザーの同意なく第三者に提供することはいたしません
        </li>
        <li>
          当サイトのユーザーがご自身のアカウントを削除された場合、当サイトが保有する当該のユーザー情報（個人情報）および当該ユーザーが作成したポストはすべて削除されます
        </li>
      </ol>
    </div>
  );
}
