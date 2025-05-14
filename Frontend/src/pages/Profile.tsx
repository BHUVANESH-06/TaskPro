import React from 'react';

const mockUser = {
  name: 'Chullu',
  role: 'Frontend Developer',
  email: 'chullu@taskpro.com',
  joinedDate: '2024-11-01',
  tasksAssigned: 5,
  tasksCompleted: 2,
  profilePic: 'https://i.pravatar.cc/100?u=chullu',
};

export const Profile = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md mt-10">
      <div className="flex items-center space-x-6">
        <img
          className="w-24 h-24 rounded-full border-2 border-blue-500"
          src={mockUser.profilePic}
          alt="Profile"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{mockUser.name}</h2>
          <p className="text-gray-500">{mockUser.role}</p>
          <p className="text-sm text-gray-400">{mockUser.email}</p>
          <p className="text-sm text-gray-400">Joined: {mockUser.joinedDate}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-100 rounded-lg py-4">
          <p className="text-lg font-semibold text-blue-600">
            {mockUser.tasksAssigned}
          </p>
          <p className="text-sm text-gray-600">Tasks Assigned</p>
        </div>
        <div className="bg-green-100 rounded-lg py-4">
          <p className="text-lg font-semibold text-green-600">
            {mockUser.tasksCompleted}
          </p>
          <p className="text-sm text-gray-600">Tasks Completed</p>
        </div>
      </div>
    </div>
  );
};
