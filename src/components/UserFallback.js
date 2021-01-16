import React, { useRef } from 'react';
import { UserView } from './UserView';

export const UserFallback = ({ userName }) => {
  const initialName = useRef(userName).current;
  const fallbackData = {
    followers: 0,
    public_repos: 0,
    name: initialName,
    bio: 'loading...',
    avatar_url: '/img/github.png',
  };

  return <UserView user={fallbackData} />;
};
