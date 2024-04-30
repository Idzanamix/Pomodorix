import { assoc } from './assoc';

export const generateRandomString = () => Math.random().toString(36).substring(2, 15);

export const assignId = assoc('id', generateRandomString());

export const generateId = (obj: any) => assoc('id', generateRandomString())(obj);
