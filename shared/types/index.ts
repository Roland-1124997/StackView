import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';

export type { SupabaseClient } from '@supabase/supabase-js';
export type { SubmissionHandler, FormActions } from 'vee-validate';
export type { Editor } from "@tiptap/core";

export type FetchUrl = Parameters<typeof $fetch>[0];
export type SendOptions = {
    extends?: FetchUrl;
} & Parameters<typeof $fetch>[1];

export type MethodOptions = Omit<SendOptions, 'method'>

export type MetaData = {
    size: number;
    mimetype: string;
    created_at: string;
    updated_at: string;
    extension: string;
}

export type FileData = {
    id: string;
    name: string;
    published: boolean;
    media: {
        preview: string;
    };
    metadata: MetaData
}

export type FileType = {
    extension: string;
    label: string;
    color: string;
    background: string;
}

export type Status = {
    success: boolean;
    redirect?: string,
    refresh?: boolean,
    message: string;
    code: number;
}

export type Meta = {
    id: string;
    name?: string;
    description?: string;
}

export type Pagination = {
    page: number;
    total: number;
}

export type ErrorResponse = {
    type: 'fields' | 'auth';
    details: ZodIssue[] | AuthError | object
}

export type ApiResponse<T> = {
    status: Status;
    meta?: Meta;
    pagination?: Pagination;
    data?: T | null;
    error?: ErrorResponse;
}

export type requestOptions<T = unknown> = {
    url: FetchUrl;
    method: SendOptions['method'];
    successMessage?: string;
    onsuccess?: (response: ApiResponse<T>) => void;
    onfailure?: (error: ErrorResponse) => void
}

export type Anchor = {
    id: string;
    level: number;
    itemIndex: number;
    textContent: string;
};

type search = {
    label: string,
    placeholder: string,
}

type Filters = {
    type: string,
    iconName: string,
    label: string,
    alwaysShowLabel: boolean,
    ariaLabel: string,
    color: string,
    large: boolean,
}

type Buttons = {
    iconName: string,
    to: string,
    description: string,
    isSmall: boolean,
    isButton: boolean,
    onClick?: 'triggerFileSelect' | 'refresh',
}

type ToolBar = {
    stacked: boolean;
    groupWithFilters: boolean;
    buttons: Buttons[];
    filters: Filters[];
    search: search;
}

export type requests = {
    name: string;
    endpoint: string;
}

export type RouteType = {
    label: string;
    iconName: string;
    alert?: boolean;
    toolbar?: ToolBar;
    requests?: requests[];
};