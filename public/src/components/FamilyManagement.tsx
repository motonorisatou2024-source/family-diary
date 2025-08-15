import React, { useState } from 'react';
import { UserPlus, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface FamilyManagementProps {
  user: User;
}

const FamilyManagement = ({ user }: FamilyManagementProps) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [familyMembers] = useState([
    { id: '1', display_name: 'お父さん', email: 'dad@example.com', role: 'admin', joined_at: '2024-01-01' },
    { id: '2', display_name: 'お母さん', email: 'mom@example.com', role: 'parent', joined_at: '2024-01-01' },
    { id: '3', display_name: '太郎', email: 'taro@example.com', role: 'child', joined_at: '2024-01-15' },
    { id: '4', display_name: '花子', email: 'hanako@example.com', role: 'child', joined_at: '2024-01-15' }
  ]);

  const handleInvite = () => {
    if (inviteEmail) {
      console.log('Inviting:', inviteEmail);
      setInviteEmail('');
      setShowInviteForm(false);
      // 実際の招待処理をここに実装
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return '管理者';
      case 'parent': return '両親';
      case 'child': return '子供';
      default: return 'メンバー';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'parent': return 'bg-blue-100 text-blue-800';
      case 'child': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">家族管理</h2>
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>家族を招待</span>
        </button>
      </div>

      {/* 家族情報 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">田中家</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">作成日:</span>
            <span className="ml-2 text-gray-900">2024年1月1日</span>
          </div>
          <div>
            <span className="text-gray-500">メンバー数:</span>
            <span className="ml-2 text-gray-900">{familyMembers.length}人</span>
          </div>
          <div>
            <span className="text-gray-500">招待コード:</span>
            <span className="ml-2 text-gray-900 font-mono">FAMILY123</span>
          </div>
        </div>
      </div>

      {/* メンバー一覧 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">メンバー一覧</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {familyMembers.map((member) => (
            <div key={member.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{member.display_name}</h4>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-400">
                    参加日: {new Date(member.joined_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                {getRoleLabel(member.role)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 招待フォーム */}
      {showInviteForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">家族を招待</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="招待したい人のメールアドレス"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowInviteForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteEmail}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  招待を送信
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyManagement;
