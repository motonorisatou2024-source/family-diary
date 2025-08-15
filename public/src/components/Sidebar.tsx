import React from 'react';
import { Home, BookOpen, Users, Settings, LogOut, CheckSquare, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar = ({ currentView, onViewChange, user, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'ホーム' },
    { id: 'diary', icon: BookOpen, label: '日記一覧' },
    { id: 'family', icon: Users, label: '家族管理' },
    { id: 'settings', icon: Settings, label: '設定' }
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">家族日記</h2>
            <p className="text-sm text-gray-500">思い出を共有</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentView === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.display_name || user.email}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
