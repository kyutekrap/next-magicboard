export class PageClass {
    page_id: string;
    page_name: string;
    favorite_flag: boolean;
    module: string;

    constructor()
    constructor(page_id: string, page_name: string, favorite_flag: boolean, module: string)

    constructor(page_id?: string, page_name?: string, favorite_flag?: boolean, module?: string) {
        this.page_id = page_id ?? "";
        this.page_name = page_name ?? "";
        this.favorite_flag = favorite_flag ?? false;
        this.module = module ?? "";
    }
}