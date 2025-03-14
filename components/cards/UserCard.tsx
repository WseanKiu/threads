"use client"

import Image from 'next/image';
import React from 'react'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

const UserCard = ({
  id,
  name,
  username,
  imgUrl,
  personType,
}: Props )=> {
  const router = useRouter();
  
  const isCommunity = personType === 'Community';
  return (
    <article className='user-card'>
      <div className='user-card_avatar'>
        <Image
          src={imgUrl}
          alt="logo"
          width={48}
          height={48}
          className='rounded-full max-h-[48px]'
        />

        <div className='flex-1 text-ellipsis'>
          <h4 className='text-bold text-light-1'>{name}</h4>
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>

      <Button 
      className='user-card_btn' 
      onClick={() => {
        if (isCommunity) {
          router.push(`/communities/${id}`)
        } else {
          router.push(`/profile/${id}`)
        }
      }}>
        View
      </Button>
    </article>
  )
}

export default UserCard