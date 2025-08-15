import React, { useState, useEffect } from 'react';
import { Camera, Plus } from 'lucide-react';
import { User, DiaryEntry, Category, Comment } from './types';
import { AuthContext } from './AuthContext';
import LoginPage from './components/LoginPage';
import DiaryEntryCard from './components/DiaryEntryCard';
import CreateDiaryForm from './components/CreateDiaryForm';
import Sidebar from './components/Sidebar';
import FamilyManagement from './components/FamilyManagement';
import SettingsPage from './components/SettingsPage';
import { auth, db } from './firebase'; // Firebase authとdbをインポート
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const FamilyDiaryApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 初期読み込み状態
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [entries, setEntries] = useState<DiaryEntry[]>([]); // 初期値は空配列

  const categories: Category[] = [
    { id: 'cat1', name: '家族の時間', color: '#10b981' },
    { id: 'cat2', name: '成長記録', color: '#f59e0b' },
    { id: 'cat3', name: '記念日', color: '#ef4444' },
    { id: 'cat4', name: '旅行', color: '#8b5cf6' }
  ];

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // ログインしている場合
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          display_name: firebaseUser.displayName,
          avatar_url: firebaseUser.photoURL,
        });
      } else {
        // ログアウトしている場合
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  // Firestoreから日記データを取得
  useEffect(() => {
    if (!user) {
      setEntries([]);
      return;
    }

    const entriesCollection = collection(db, 'diaries');
    const unsubscribe = onSnapshot(entriesCollection, (snapshot) => {
      const entriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DiaryEntry));
      setEntries(entriesData);
    });

    return () => unsubscribe();
  }, [user]);


  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed: ", error);
      alert("ログインに失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const handleLike = (entryId: string) => {
    // Firestoreでのいいね処理に置き換える
  };

  const handleComment = (entryId: string, content: string) => {
    // Firestoreでのコメント処理に置き換える
  };

  const handleCreateEntry = async (data: any) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'diaries'), {
        ...data,
        author_id: user.id,
        created_at: serverTimestamp(),
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  if (isLoading) {
    return <div>読み込み中...</div>; // ローディング表示
  }

  if (!user) {
    return (
      <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, isLoading }}>
        <LoginPage />
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
        <Sidebar 
          currentView={currentView}
          onViewChange={setCurrentView}
          user={user}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col">
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
          <main className="flex-1 p-6 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
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
