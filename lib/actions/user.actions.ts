"use server"

import { connectToDB } from "../mongoose"
import { revalidatePath } from "next/cache";

import User from '../models/user.model';
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string
}

export async function updateuser({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId }, 
      {
        username: username.toLocaleLowerCase(),
        name,
        bio,
        image,
        onboarded: true
    },
    { upsert: true } // update or insert = upsert
    )
  
    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
}

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User
      .findOne({ id: userId })
  //     .populate({
  //       path: 'communities',
  //       model: Communities,
  //     })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

export async function fetchUserThreads (userId: string) {
  try {
    connectToDB();

    // TODO: Populate community

    const threads = await User.findOne({ id: userId })
      .populate({
        path: 'threads',
        model: Thread,
        populate: {
          path: 'children',
          model: Thread,
          populate: {
            path: 'author',
            model: User,
            select: 'name image id'
          }
        }
      })

      return threads;
  } catch (error: any) {
    throw new Error(`Failed fetching user threads. ${error.message}`)
  }
}

export async function fetchUsers ({
  userId,
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc'
} : {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");
    const query:FilterQuery<typeof User> = {
      id: { $ne: userId } // $ne = not equal
    }

    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex }},
        { name: { $regex: regex }}
      ]
    }

    const sortOptions = { createdAt: sortBy }

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    
    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext }
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}