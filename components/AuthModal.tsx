'use client';

import { useState } from 'react';
import { useLanguage } from '../lib/i18n';
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateAuthForm,
  isAuthFormValid,
  ValidationErrors,
} from '../lib/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userData: { firstName: string; lastName: string; email: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setPasswordConfirm('');
    setErrors({});
    setAuthError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const newErrors = validateAuthForm(firstName, lastName, email, password, passwordConfirm);
    setErrors(newErrors);

    if (!isAuthFormValid(newErrors)) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call for sign up
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Store credentials in localStorage (in a real app, this would be encrypted/sent to secure backend)
      const userData = { firstName, lastName, email };
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authTimestamp', new Date().toISOString());

      onAuthSuccess(userData);
      resetForm();
      setIsSignUp(false);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : t.registrationFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call for sign in
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In a real app, verify against backend
      const storedUser = localStorage.getItem('authUser');
      if (!storedUser) {
        setAuthError(t.emailOrPasswordIncorrect);
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      localStorage.setItem('authTimestamp', new Date().toISOString());

      onAuthSuccess(userData);
      resetForm();
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : t.signInFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-8 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-zinc-900">
            {isSignUp ? t.createAccount : t.signIn}
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            {isSignUp ? t.toUploadExcel : t.toAccessExcel}
          </p>
        </div>

        {authError && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            {authError}
          </div>
        )}

        <form onSubmit={isSignUp ? handleSignUpSubmit : handleSignInSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">
                  {t.firstName} *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => {
                    const error = validateFirstName(firstName);
                    setErrors((prev) => ({
                      ...prev,
                      firstName: error,
                    }));
                  }}
                  placeholder="e.g. Jean"
                  className={`w-full rounded-lg border px-4 py-2 text-sm font-medium placeholder-zinc-400 transition ${
                    errors.firstName
                      ? 'border-red-300 bg-red-50 text-red-900'
                      : 'border-zinc-300 bg-white text-zinc-900 focus:border-sky-500 focus:outline-none'
                  }`}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1">
                  {t.lastName} *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => {
                    const error = validateLastName(lastName);
                    setErrors((prev) => ({
                      ...prev,
                      lastName: error,
                    }));
                  }}
                  placeholder="e.g. Dupont"
                  className={`w-full rounded-lg border px-4 py-2 text-sm font-medium placeholder-zinc-400 transition ${
                    errors.lastName
                      ? 'border-red-300 bg-red-50 text-red-900'
                      : 'border-zinc-300 bg-white text-zinc-900 focus:border-sky-500 focus:outline-none'
                  }`}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">
              {t.gmailAddress} *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                const error = validateEmail(email);
                setErrors((prev) => ({
                  ...prev,
                  email: error,
                }));
              }}
              placeholder="example@gmail.com"
              className={`w-full rounded-lg border px-4 py-2 text-sm font-medium placeholder-zinc-400 transition ${
                errors.email
                  ? 'border-red-300 bg-red-50 text-red-900'
                  : 'border-zinc-300 bg-white text-zinc-900 focus:border-sky-500 focus:outline-none'
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1">
              {t.password} *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => {
                const error = validatePassword(password);
                setErrors((prev) => ({
                  ...prev,
                  password: error,
                }));
              }}
              placeholder="••••••"
              className={`w-full rounded-lg border px-4 py-2 text-sm font-medium placeholder-zinc-400 transition ${
                errors.password
                  ? 'border-red-300 bg-red-50 text-red-900'
                  : 'border-zinc-300 bg-white text-zinc-900 focus:border-sky-500 focus:outline-none'
              }`}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
            {isSignUp && !errors.password && password.length > 0 && (
              <p className="mt-1 text-xs text-emerald-600">{t.passwordValid}</p>
            )}
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1">
                {t.confirmPassword} *
              </label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="••••••"
                className={`w-full rounded-lg border px-4 py-2 text-sm font-medium placeholder-zinc-400 transition ${
                  errors.passwordConfirm
                    ? 'border-red-300 bg-red-50 text-red-900'
                    : 'border-zinc-300 bg-white text-zinc-900 focus:border-sky-500 focus:outline-none'
                }`}
                disabled={isLoading}
              />
              {errors.passwordConfirm && (
                <p className="mt-1 text-xs text-red-600">{errors.passwordConfirm}</p>
              )}
            </div>
          )}

          {isSignUp && (
            <div className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600">
              <p className="font-semibold text-zinc-700 mb-2">{t.passwordRequirements}</p>
              <ul className="space-y-1 text-left">
                <li>{t.passwordReq1}</li>
                <li>{t.passwordReq2}</li>
                <li>{t.passwordReq3}</li>
                <li>{t.passwordReq4}</li>
                <li>{t.passwordReq5}</li>
                <li>{t.passwordReq6}</li>
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : isSignUp ? t.createAccountBtn : t.signInBtn}
          </button>
        </form>

        <div className="mt-4 border-t border-zinc-200 pt-4">
          <button
            onClick={() => {
              resetForm();
              setIsSignUp(!isSignUp);
            }}
            disabled={isLoading}
            className="w-full text-sm text-sky-600 hover:text-sky-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSignUp ? t.alreadyHaveAccount : t.dontHaveAccount}
          </button>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-2xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
}
