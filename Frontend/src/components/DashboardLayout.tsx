import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

const DashboardLayout: React.FC = () => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);

  return (
    <div className="flex">
      <Sidebar />
      <div
        className="transition-all duration-300 p-6 w-full"
        style={{ marginLeft: isOpen ? '220px' : '60px' }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
