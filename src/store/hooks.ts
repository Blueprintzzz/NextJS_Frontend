/**
 * Typed Redux hooks.
 *
 * Use these instead of the plain useDispatch / useSelector from react-redux
 * so TypeScript infers RootState and AppDispatch automatically.
 */
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);
