import IssueDetailPage from "./issue-detail";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <IssueDetailPage params={params} />;
}
