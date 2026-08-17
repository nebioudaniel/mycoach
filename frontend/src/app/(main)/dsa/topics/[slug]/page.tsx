import TopicPage from "./topic-page";

export function generateStaticParams() {
  return [{ slug: "hash-maps" }];
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <TopicPage params={params} />;
}
