import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreadPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";


export default async function Home() {
  const result = await fetchThreadPosts(1, 30);
  const user = currentUser();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ): (
          <>
            {result.threads.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUser={user?.id || ''}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
