import React, { useState } from 'react';
import { Heart, MessageCircle, User, Calendar, Lock, Users, Tag } from 'lucide-react';
import { DiaryEntry } from '../types';

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onLike: (id: string) => void;
  onComment: (id: string, content: string) => void;
}

const DiaryEntryCard = ({ entry, onLike, onComment }: DiaryEntryCardProps) => {
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

export default DiaryEntryCard;
