import ProblemWorkspace from "./problem-workspace";

export function generateStaticParams() {
  return [{ slug: "two-sum" }, { slug: "valid-anagram" }];
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <ProblemWorkspace params={params} />;
}
