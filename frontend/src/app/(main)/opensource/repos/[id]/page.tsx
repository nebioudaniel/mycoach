import RepoDetailPage from "./repo-detail";

export function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <RepoDetailPage params={params} />;
}
