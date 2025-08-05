import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Heart, MessageCircle, Camera, Calendar, User, Tag, Lock, Globe, Users, 
  Plus, Menu, Settings, LogOut, Home, BookOpen, UserPlus, Eye, EyeOff, Mail, CheckSquare, Info
} from 'lucide-react';

// 型定義
interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
}

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author?: User;
  privacy_level: 'family' | 'parents_only' | 'private';
  event_date: string;
  created_at: string;
  images?: { id: string; image_url: string; caption?: string }[];
  like_count?: number;
  comment_count?: number;
  is_liked?: boolean;
  category?: { id: string; name: string; color: string };
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  author?: User;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

// 認証コンテキスト
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false
});

// ログインページ
const LoginPage = ({ onLogin }: { onLogin: (email: string, password: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* ロゴとタイトル */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">家族日記</h1>
          <p className="text-white/80 text-lg">家族みんなで使える記録帳</p>
        </div>

        {/* ログインフォーム */}
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ログイン</h2>
              <p className="text-gray-600">アカウントにログインしてください</p>
            </div>

            <div className="space-y-6">
              {/* メールアドレス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="メールアドレスを入力"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="パスワードを入力"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* ログインボタン */}
              <button
                onClick={handleSubmit}
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '認証中...' : 'ログイン'}
              </button>
            </div>

            {/* デモ用ログイン */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">デモアカウント</p>
                  <p>メール: demo@example.com</p>
                  <p>パスワード: password123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 日記エントリーカード
const DiaryEntryCard = ({ 
  entry, 
  onLike, 
  onComment 
}: {
  entry: DiaryEntry;
  onLike: (id: string) => void;
  onComment: (id: string, content: string) => void;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(entry.id, commentText);
      setCommentText('');
    }
  };

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'family': return <Users className="w-4 h-4" />;
      case 'parents_only': return <Lock className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getPrivacyLabel = (level: string) => {
    switch (level) {
      case 'family': return '家族';
      case 'parents_only': return '両親のみ';
      case 'private': return '非公開';
      default: return '家族';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{entry.author?.display_name || 'ユーザー'}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>{new Date(entry.event_date).toLocaleDateString('ja-JP')}</span>
                <div className="flex items-center space-x-1">
                  {getPrivacyIcon(entry.privacy_level)}
                  <span>{getPrivacyLabel(entry.privacy_level)}</span>
                </div>
              </div>
            </div>
          </div>
          {entry.category && (
            <div 
              className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${entry.category.color}20`,
                color: entry.category.color
              }}
            >
              <Tag className="w-3 h-3" />
              <span>{entry.category.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* 画像 */}
      {entry.images && entry.images.length > 0 && (
        <div className="relative">
          <img
            src={entry.images[0].image_url}
            alt={entry.images[0].caption || entry.title}
            className="w-full h-64 object-cover"
          />
          {entry.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
              +{entry.images.length - 1}
            </div>
          )}
        </div>
      )}

      {/* コンテンツ */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{entry.title}</h2>
        <p className="text-gray-700 leading-relaxed">{entry.content}</p>
      </div>

      {/* アクション */}
      <div className="px-4 py-3 border-t border-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(entry.id)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-colors ${
                entry.is_liked
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${entry.is_liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{entry.like_count || 0}</span>
            </button>
            
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{entry.comment_count || 0}</span>
            </button>
          </div>
          
          <span className="text-xs text-gray-400">
            {new Date(entry.created_at).toLocaleString('ja-JP')}
          </span>
        </div>

        {/* コメントセクション */}
        {showComments && (
          <div className="mt-4 space-y-3">
            {/* 既存のコメント */}
            {entry.comments && entry.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.author?.display_name || 'ユーザー'}
                    </p>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comment.created_at).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>
            ))}

            {/* コメント入力 */}
            <div className="flex space-x-3">
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="コメントを入力..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  投稿
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 日記作成フォーム
const CreateDiaryForm = ({ 
  categories, 
  onSubmit, 
  onCancel 
}: {
  categories: Category[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category_id: '',
    privacy_level: 'family',
    event_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = () => {
    if (formData.title && formData.content) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">新しい日記を作成</h2>
          
          <div className="space-y-4">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タイトル
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="今日の出来事を表すタイトル"
              />
            </div>

            {/* 日付 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日付
              </label>
              <input
                type="date"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* カテゴリー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリー
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">カテゴリーを選択</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* プライバシー設定 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                公開範囲
              </label>
              <select
                value={formData.privacy_level}
                onChange={(e) => setFormData(prev => ({ ...prev, privacy_level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="family">家族</option>
                <option value="parents_only">両親のみ</option>
                <option value="private">非公開</option>
              </select>
            </div>

            {/* 内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="今日の出来事や思い出を書いてください..."
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              disabled={!formData.title || !formData.content}
            >
              投稿
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// サイドバーナビゲーション
const Sidebar = ({ 
  currentView, 
  onViewChange, 
  user, 
  onLogout 
}: {
  currentView: string;
  onViewChange: (view: string) => void;
  user: User;
  onLogout: () => void;
}) => {
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
            <User className="w-4 h-4 text-white" />
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

// 家族管理ページ
const FamilyManagement = ({ user }: { user: User }) => {
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
                  <User className="w-5 h-5 text-white" />
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

// 設定ページ
const SettingsPage = ({ user }: { user: User }) => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    comments: true,
    likes: true
  });

  const [privacy, setPrivacy] = useState({
    defaultPrivacy: 'family',
    allowSearch: true
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">設定</h2>

      {/* プロフィール設定 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">プロフィール</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              表示名
            </label>
            <input
              type="text"
              defaultValue={user.display_name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              disabled
            />
          </div>
        </div>
      </div>

      {/* 通知設定 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">通知設定</h3>
        <div className="space-y-4">
          {Object.entries({
            email: 'メール通知',
            push: 'プッシュ通知',
            comments: 'コメント通知',
            likes: 'いいね通知'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* プライバシー設定 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">プライバシー設定</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              デフォルトの公開範囲
            </label>
            <select
              value={privacy.defaultPrivacy}
              onChange={(e) => setPrivacy(prev => ({ ...prev, defaultPrivacy: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="family">家族</option>
              <option value="parents_only">両親のみ</option>
              <option value="private">非公開</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
          設定を保存
        </button>
      </div>
    </div>
  );
};

// メインアプリ
const FamilyDiaryApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [entries, setEntries] = useState<DiaryEntry[]>([
    {
      id: '1',
      title: '公園での楽しい一日',
      content: '今日は家族みんなで近所の公園に行きました。子供たちは滑り台やブランコで元気いっぱい遊んでいました。お母さんが作ってくれたお弁当も美味しくて、とても幸せな時間を過ごせました。',
      author_id: 'user1',
      author: { id: 'user1', email: 'dad@example.com', display_name: 'お父さん' },
      privacy_level: 'family',
      event_date: '2024-08-04',
      created_at: '2024-08-04T14:30:00Z',
      like_count: 3,
      comment_count: 2,
      is_liked: false,
      category: { id: 'cat1', name: '家族の時間', color: '#10b981' },
      images: [
        { id: 'img1', image_url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop', caption: '公園での家族写真' }
      ],
      comments: [
        { id: 'c1', content: '楽しそうですね！', author: { id: 'user2', email: 'mom@example.com', display_name: 'お母さん' }, created_at: '2024-08-04T15:00:00Z' }
      ]
    },
    {
      id: '2',
      title: '息子の初めての自転車',
      content: '息子が補助輪なしで自転車に乗れるようになりました！最初は怖がっていましたが、何度も練習して、ついに一人で乗れるようになった時の笑顔は忘れられません。',
      author_id: 'user2',
      author: { id: 'user2', email: 'mom@example.com', display_name: 'お母さん' },
      privacy_level: 'family',
      event_date: '2024-08-03',
      created_at: '2024-08-03T16:15:00Z',
      like_count: 5,
      comment_count: 1,
      is_liked: true,
      category: { id: 'cat2', name: '成長記録', color: '#f59e0b' },
      images: [
        { id: 'img2', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', caption: '自転車に乗る息子' }
      ]
    }
  ]);

  const categories: Category[] = [
    { id: 'cat1', name: '家族の時間', color: '#10b981' },
    { id: 'cat2', name: '成長記録', color: '#f59e0b' },
    { id: 'cat3', name: '記念日', color: '#ef4444' },
    { id: 'cat4', name: '旅行', color: '#8b5cf6' }
  ];

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    // デモ用ログイン処理
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password123') {
        setUser({
          id: 'demo-user',
          email: 'demo@example.com',
          display_name: 'デモユーザー'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleLike = (entryId: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        const isLiked = !entry.is_liked;
        return {
          ...entry,
          is_liked: isLiked,
          like_count: isLiked 
            ? (entry.like_count || 0) + 1 
            : Math.max((entry.like_count || 0) - 1, 0)
        };
      }
      return entry;
    }));
  };

  const handleComment = (entryId: string, content: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      content,
      author: user,
      created_at: new Date().toISOString()
    };

    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          comments: [...(entry.comments || []), newComment],
          comment_count: (entry.comment_count || 0) + 1
        };
      }
      return entry;
    }));
  };

  const handleCreateEntry = (data: any) => {
    const newEntry: DiaryEntry = {
      id: `entry-${Date.now()}`,
      title: data.title,
      content: data.content,
      author_id: user?.id || '',
      author: user,
      privacy_level: data.privacy_level,
      event_date: data.event_date,
      created_at: new Date().toISOString(),
      like_count: 0,
      comment_count: 0,
      is_liked: false,
      category: data.category_id ? categories.find(c => c.id === data.category_id) : undefined
    };

    setEntries(prev => [newEntry, ...prev]);
    setShowCreateForm(false);
  };

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, isLoading }}>
        <LoginPage onLogin={handleLogin} />
      </AuthContext.Provider>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
      case 'diary':
        return (
          <div className="space-y-6">
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">まだ日記がありません</h3>
                <p className="text-gray-500 mb-4">最初の思い出を記録してみましょう</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  日記を作成
                </button>
              </div>
            ) : (
              entries.map((entry) => (
                <DiaryEntryCard
                  key={entry.id}
                  entry={entry}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              ))
            )}
          </div>
        );
      case 'family':
        return <FamilyManagement user={user} />;
      case 'settings':
        return <SettingsPage user={user} />;
      default:
        return <div>ページが見つかりません</div>;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, isLoading }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* サイドバー */}
        <Sidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          user={user}
          onLogout={handleLogout}
        />

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentView === 'home' && 'ホーム'}
                    {currentView === 'diary' && '日記一覧'}
                    {currentView === 'family' && '家族管理'}
                    {currentView === 'settings' && '設定'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentView === 'home' && '最新の家族の思い出'}
                    {currentView === 'diary' && '家族みんなの日記'}
                    {currentView === 'family' && '家族メンバーの管理'}
                    {currentView === 'settings' && 'アプリの設定'}
                  </p>
                </div>
                {(currentView === 'home' || currentView === 'diary') && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>新しい日記</span>
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* メインコンテンツエリア */}
          <main className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </main>
        </div>

        {/* 作成フォーム */}
        {showCreateForm && (
          <CreateDiaryForm
            categories={categories}
            onSubmit={handleCreateEntry}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
};

export default FamilyDiaryApp;
