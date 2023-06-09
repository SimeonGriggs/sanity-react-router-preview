// ./app/routes/$slug.tsx

import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { SanityDocument } from "@sanity/client";
import { GroqStoreProvider } from "@sanity/preview-kit/groq-store";
import ExitPreview from "~/components/ExitPreview";

import Post from "~/components/Post";

import { getClient, dataset, projectId } from "~/lib/sanity";
import { getSession } from "~/sessions";

export const loader = async ({ params, request }: LoaderArgs) => {
  const query = `*[_type == "post" && slug.current == $slug][0]`;
  const session = await getSession(request.headers.get("Cookie"));
  const preview = session.get("preview");

  const post: SanityDocument[] = await getClient(preview).fetch(query, params);

  return {
    post,
    preview,
    query: preview ? query : null,
    params: preview ? params : null,
  };
};

export default function PostRoute() {
  const { preview, query, params, post } = useLoaderData();

  const children = <Post post={post} query={query} params={params} />;

  return preview ? (
    <GroqStoreProvider projectId={projectId} dataset={dataset}>
      <>
        {children}
        <ExitPreview />
      </>
    </GroqStoreProvider>
  ) : (
    children
  );
}
