import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          看准
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">首页</Link>
          {user ? (
            <>
              <Link to="/create-company" className="text-gray-600 hover:text-blue-600">
                添加公司
              </Link>
              <span className="text-gray-500">欢迎, {user.username}</span>
              <button
                onClick={logout}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">登录</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700">
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
