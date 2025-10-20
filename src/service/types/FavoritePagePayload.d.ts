import { DefaultPayload } from "./DefaultPayload";

export interface FavoritePagePayload extends DefaultPayload {
    page_id: string;
    event: boolean;
}