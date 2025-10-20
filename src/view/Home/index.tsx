'use client';

import { validateString } from '@/common';
import { Appbar, Header, Paragraph } from '@/components';
import { GlobalStrings } from '@/model';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import ListView from './ListView';
import ItemView from './ItemView';

const Home = () => {
    const searchParams = useSearchParams();
    const pageId = searchParams.get('id') ?? "";
    const itemId = searchParams.get('item') ?? "";
    const [strings, setStrings] = useState<Record<string, string>>({});

    useEffect(() => {
        setStrings(GlobalStrings.getAll("dashboard"));
    }, []);

    const Welcome = () => (
        <div className='flex flex-col justify-center items-center w-full h-screen'>
            <Header>{strings?.welcomeTo}</Header>
            <Paragraph textAlign='center'>{strings?.startNavigating}</Paragraph>
        </div>
    )

    const Container = ({children}: {children: React.ReactNode}) => (
        <div className='mt-20 pb-4'>
            {children}
        </div>
    )

    return (
        <Suspense>
            <Appbar />
            { validateString(pageId) && validateString(itemId) ? (
                <Container>
                    <ItemView pageId={pageId} itemId={itemId} />
                </Container>
            ) :
            validateString(pageId) ? ( 
                <Container>
                    <ListView pageId={pageId} /> 
                </Container>
            ) : ( <Welcome /> ) }
        </Suspense>
    );
}

export default Home