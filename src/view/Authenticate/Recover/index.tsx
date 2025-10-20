'use client';

import { Button, Header, FieldSet, Label, Input } from '@/components';
import { GuestStrings } from '@/model';
import React, { useEffect, useState } from 'react';
import Verify from '../Verify';
import { RecoverService } from '@/service/RecoverService';
import { RecoverPayload } from '@/service/types';
import { validateAllKeys } from '@/common';
import Line from '@/components/Line';

const RecoverForm = ({
    innerPage, navigate, strings, payload, setPayload
}: { innerPage: Function, navigate: Function, strings: Record<string, string>, payload: RecoverPayload, setPayload: Function }) => {

    const [disabled, setDisabled] = useState(false);

    function updateData(e: any) {
        setPayload({...payload, ...e});
    }

    function submit() {
        if (!validateAllKeys(payload)) return;
        setDisabled(true);
        RecoverService(payload).then(response => {
            if (response !== null) {
                innerPage(1);
            }
        }).finally(() => {
            setDisabled(false);
        });
    }

    return (
        <div className="flex flex-col space-y-6">
            <Header>{strings?.recover}</Header>
            <div className='flex flex-col space-y-2'>
                <FieldSet direction='column'>
                    <Label>{strings?.email}</Label>
                    <Input.Line onChange={updateData} name='email' />
                </FieldSet>
            </div>
            <div className='flex flex-col space-y-3'>
                <Button variant='contained' onClick={submit} disabled={disabled}>{strings?.sendLink}</Button>
                <Line />
                <Button color='error' variant='outlined' onClick={() => navigate(0)}>{strings?.cancel}</Button>
            </div>
        </div>
    );
};

const Recover = ({ navigate }: { navigate: Function }) => {
    const [view, setView] = useState(0);
    const [strings, setStrings] = useState<Record<string, string>>({});
    const [payload, setPayload] = useState<RecoverPayload>({
        email: ""
    });

    useEffect(() => {
        setStrings(GuestStrings.getAll());
    }, []);

    return (
        <div className='w-[24rem] mx-auto '>
            { view === 0 ? (
                <RecoverForm innerPage={setView} navigate={navigate} strings={strings} payload={payload} setPayload={setPayload} />
            ): view === 1 ? (
                <Verify innerPage={() => setView(2)} navigate={navigate} defaultPayload={payload} />
            ): null }
        </div>
    );
}

export default Recover;