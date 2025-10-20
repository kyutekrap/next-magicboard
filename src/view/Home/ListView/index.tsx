'use client';

import { TableView } from '@/components';
import React from 'react';

const ListView = ({ pageId }: { pageId: string }) => {
    return (
        <div className="px-2">
            <TableView pageId={pageId}>
                <TableView.Header />
                <TableView.Body />
            </TableView>
        </div>
    )
}

export default ListView