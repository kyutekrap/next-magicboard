'use client';

import { show } from '@/common';
import { CircularProgress, Form, PageLayout, Paragraph, TableView } from '@/components';
import IconButton from '@/components/IconButton';
import { GlobalData, GlobalKeys, GlobalModules, GlobalPageLayout, GlobalPages } from '@/model';
import { ItemViewService } from '@/service';
import { ItemViewPayload, ItemViewResponse } from '@/service/types';
import { FlowModel, PageModel, RelatedPageModel } from '@/model/types';
import React, { useEffect, useState } from 'react';

const ItemView = ({ pageId, itemId }: { pageId: string, itemId: string }) => {
    const module = GlobalModules.getActivated();
    const [spinner, setSpinner] = useState(true);
    const [relatedPages, setRelatedPages] = useState<RelatedPageModel[]>([]);
    const [flows, setFlows] = useState<FlowModel[]>([]);
    const [page, setPage] = useState<PageModel>();

    useEffect(() => {
        GlobalPages.get(pageId).then(response => {
            if (response) {
                setPage(response);
            }
        });
        const payload: ItemViewPayload = {
            item_id: itemId,
            module_id: module?.name ?? '',
            page_id: pageId
        }
        ItemViewService(payload).then((response: ItemViewResponse) => {
            if (response !== null) {
                GlobalData.set(pageId, [response.header]);
                setRelatedPages(response.pages);
                GlobalPageLayout.set({[pageId]: response.pages});
                GlobalKeys.set(pageId, response.keys);
                setFlows(response.flows);
                setSpinner(false);
            }
        });
    }, []);

    function openPageLayout() {
        show(<PageLayout pageId={pageId} relatedPages={relatedPages} setRelatedPages={setRelatedPages} />);
    }
    
    return (
        spinner ? (
            <div className='h-[80vh] w-full flex justify-content items-align'>
                <CircularProgress />
            </div>
        ): (
            <div className="flex flex-col space-y-4">
                <div className="px-6">
                    <div className='flex flex-row space-x-1 items-center'>
                        <Paragraph>{page?.page_name}</Paragraph>
                        <IconButton onClick={() => openPageLayout()}>
                            <img src="/icons/layout.svg" width={20} height={20} className='dark:invert' />
                        </IconButton>
                    </div>
                    <Form pageId={pageId}>
                        <Form.Data position={0} flows={flows.filter(f => !f.is_bulk)} />
                    </Form>
                </div>
                
                { relatedPages.map((p: RelatedPageModel) => (
                    p.visibility && (
                        <div key={p._id} className='border border-neutral mx-4 rounded'>
                            <TableView pageId={p._id} parentId={pageId} itemId={itemId}>
                                <TableView.Header border />
                                <TableView.Body rowsPerPage={5} />
                            </TableView>
                        </div>
                    )
                )) }
            </div>
        )
    );
}

export default ItemView