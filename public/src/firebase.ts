import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: .env.localファイルを作成し、そこにFirebaseの認証情報を設定してください
// REACT_APP_API_KEY=your-api-key
// REACT_APP_AUTH_DOMAIN=your-auth-domain
// REACT_APP_PROJECT_ID=your-project-id
// REACT_APP_STORAGE_BUCKET=your-storage-bucket
// REACT_APP_MESSAGING_SENDER_ID=your-messaging-sender-id
// REACT_APP_APP_ID=your-app-id

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// Firebaseのサービスを取得してエクスポート
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
