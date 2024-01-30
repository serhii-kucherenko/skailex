import { notFound } from "next/navigation";
import { allPrivacyPolicies } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";

import { Redis } from "@upstash/redis";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

const redis = Redis.fromEnv();

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const privacyPolicy = allPrivacyPolicies?.[0];
  console.log({
    allPrivacyPolicies,
  });

  if (!privacyPolicy) {
    notFound();
  }

  const views =
    (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ?? 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header views={views} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <Mdx code={privacyPolicy.body.code} />
      </article>
    </div>
  );
}
