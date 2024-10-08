import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約",
};

export default function TermsOfService() {
  return (
    <div className="container prose mx-auto mb-10 mt-5 px-4">
      <h1 className="text-center">利用規約</h1>
      <p className="text-right">2024 年 9 月 4 日</p>
      <ol>
        <li>当サイトは商用利用を含めすべて無料でご利用いただけます</li>
        <li>
          現在、当サイトはベータ版です。そのため、当サイト上のデータが予告なく削除される可能性があることをご了承お願いいたします
        </li>
        <li>当サイトは予告なくサービスの内容を変更する可能性があります</li>
        <li>当サイトは予告なくサービスの提供を終了する可能性があります</li>
        <li>
          当サイトの利用によってユーザーに生じたいかなる不利益等に関しても、当サイトの運営者は一切の責任を負いません
        </li>
      </ol>
    </div>
  );
}
