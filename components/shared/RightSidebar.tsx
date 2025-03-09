import { fetchCommunities } from "@/lib/actions/community.actions";
import React from "react";
import UserCard from "../cards/UserCard";
import { fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

const RightSidebar = async () => {
  const user = await currentUser();
  if(!user) return null;

  const suggestedCommunities = await fetchCommunities({ pageSize: 4})
  const suggestedUsers = await fetchUsers({
    userId: user.id,
    pageSize: 4
  })

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested communities
        </h3>

        <div className='mt-7 flex w-[350px] flex-col gap-9'>
          {suggestedCommunities.communities.length > 0 ? (
            <>
              {suggestedCommunities.communities.map((community) => (
                <UserCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  personType='Community'
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">
              No communities yet
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested users</h3>
        <div className='mt-7 flex w-[350px] flex-col gap-10'>
          {suggestedUsers.users.length > 0 ? (
            <>
              {suggestedUsers.users.map(({id, name, username, image}) => (
                <UserCard
                  key={id}
                  id={id}
                  name={name}
                  username={username}
                  imgUrl={image}
                  personType="User"
                />
              ))}
            </>
          ) : (
            <p className="!text-base-regular text-light-3">No users yet</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
