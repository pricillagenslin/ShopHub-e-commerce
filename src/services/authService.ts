import users from '../data/users.json';
import { fakeRequest } from './api';
import { User } from '../types';
const stored = (): User[] => { try { return JSON.parse(localStorage.getItem('users') || 'null') ?? users; } catch { return users; } };
export const loginUser = (email: string, password: string) =>
  fakeRequest(() => {
    const u = stored().find((x) => x.email === email && x.password === password);
    if (!u) throw new Error('Invalid email or password');
    return { id: u.id, name: u.name, email: u.email };
  });
export const registerUser = (name: string, email: string, password: string) =>
  fakeRequest(() => {
    const list = stored();
    if (list.some((x) => x.email === email)) throw new Error('Email already registered');
    const u = { id: Date.now(), name, email, password };
    localStorage.setItem('users', JSON.stringify([...list, u]));
    return { id: u.id, name, email };
  });
