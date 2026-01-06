import { useState } from 'react';
import { useAuth } from '@/components/extensions/auth-email/useAuth';
import LoginForm from '@/components/extensions/auth-email/LoginForm';
import RegisterForm from '@/components/extensions/auth-email/RegisterForm';
import SocialNetwork from '@/components/SocialNetwork';

const AUTH_URL = "https://functions.poehali.dev/402d729d-da6a-46d0-a43d-1bd6146bb7f6";

export default function Index() {
  const [showRegister, setShowRegister] = useState(false);

  const auth = useAuth({
    apiUrls: {
      login: `${AUTH_URL}?action=login`,
      register: `${AUTH_URL}?action=register`,
      verifyEmail: `${AUTH_URL}?action=verify-email`,
      refresh: `${AUTH_URL}?action=refresh`,
      logout: `${AUTH_URL}?action=logout`,
      resetPassword: `${AUTH_URL}?action=reset-password`,
    },
  });

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Социум</h1>
            <p className="text-muted-foreground">Добро пожаловать в соц. сеть</p>
          </div>

          {showRegister ? (
            <div>
              <RegisterForm
                onRegister={auth.register}
                onVerifyEmail={auth.verifyEmail}
                isLoading={auth.isLoading}
                error={auth.error}
              />
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-primary hover:underline"
                >
                  Войти
                </button>
              </p>
            </div>
          ) : (
            <div>
              <LoginForm
                onLogin={auth.login}
                isLoading={auth.isLoading}
                error={auth.error}
              />
              <p className="text-center mt-4 text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-primary hover:underline"
                >
                  Зарегистрироваться
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <SocialNetwork user={auth.user} onLogout={auth.logout} />;
}
