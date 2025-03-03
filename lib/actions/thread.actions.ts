"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import path from "path";


interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createThread ({
  text, author, communityId, path
}: Params) {

  try {
    connectToDB();
  
    const createdThread = await Thread.create({
      text,
      author,
      community: communityId
    });
  
    // updae thread model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id }
    })
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`)
  }

  revalidatePath(path);
}

export async function fetchThreadPosts (pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Pagination
  const skipAmount = (pageNumber - 1) * pageSize;

  // FETCH POSTS THAT HAVE NO PARENTS / NOT COMMENTS
  const threadsQuery = Thread
    .find({ parentId: { $in: [null, undefined]}})
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({ // Getting the comments
      path: 'children',
      populate: { // recursion for the comments thread
        path: 'author',
        model: User,
        select: "_id name parentId image" // return only this selected
      }
    })

    const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined]}})

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { threads, isNext }

}