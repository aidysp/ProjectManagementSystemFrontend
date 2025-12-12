export interface User {
    id: number;
    email: string;
    name: string;
    role: 'owner' | 'admin' | 'user' | 'guest';
    accessState: 'active' | 'inactive' | 'blocked';
    createdAt: string;
}

export interface Board {
    id: number;
    name: string;
    description: string | null;
    ownerId: number;
    isPublic: boolean;
    status: 'active' | 'archived';
    createdAt: string;
    owner_email?: string;
    owner_name?: string;
    user_role?: 'owner' | 'member';
}

export interface Column {
    id: number;
    name: string;
    boardId: number;
    orderIndex: number;
    createdAt: string;
}

export interface Task {
    id: number;
    title: string;
    description: string | null;
    columnId: number;
    status: 'active' | 'review' | 'done' | 'archived';
    priority: 'low' | 'medium' | 'high';
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

export interface Workspace {
    id: number;
    name: string;
    description: string | null;
    ownerId: number;
    status: 'active' | 'deleted';
    createdAt: string;
}

// Типы для форм
export interface LoginFormData {
    email: string;
    password: string;
}

export interface RegisterFormData extends LoginFormData {
    name: string;
}

export interface CreateBoardFormData {
    name: string;
    description?: string;
    isPublic: boolean;
}