import { FileModel } from "@/model";

export interface InputProps {
    disabled?: boolean;
    max?: number;
    min?: number;
    required?: boolean;
    name?: string;
    maxLength?: number;
    id?: string;
}

export interface InputElement {
    onChange?: ((e: Record<string, string>) => void);
    defaultValue?: string;
    value?: string;
    placeholder?: string;
}

export interface NumberElement {
    onChange?: ((e: Record<string, number>) => void);
    defaultValue?: number;
    value?: number;
    placeholder?: string;
}

export interface TextareaElement {
    onChange?: ((e: Record<string, string>) => void);
    value?: string;
    placeholder?: string;
}

export interface SelectElement {
    required?: boolean;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
}

export interface FileElement {
    defaultValue?: FileModel;
    value?: FileModel;
    required?: boolean;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange?: ((e: Record<string, FileModel>) => void);
    id?: string;
    maxLength?: number;
}