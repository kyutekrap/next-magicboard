import { FileModel } from '@/model/types';

export interface FileData {
    key: string;
    value: FileModel;
}

export interface UploadFilePayload {
    data: FileData[];
    module_id: string;
}