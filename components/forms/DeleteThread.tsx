"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  console.log('Delete: ', currentUserId, authorId)
  console.log('currentUserId !== authorId: ', currentUserId !== authorId)
  console.log('pathname: ', pathname === "/")

  if (currentUserId !== authorId) {
    return null;
  }

  return (
    <Image
      src='/assets/delete.svg'
      alt='delete'
      width={15}
      height={15}
      className='cursor-pointer object-contain'
      onClick={async () => {
        await deleteThread(JSON.parse(threadId), pathname);
        if (!parentId || !isComment) {
          router.push("/");
        }
      }}
    />
  );
}

export default DeleteThread;