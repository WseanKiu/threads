"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";


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