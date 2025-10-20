'use client';

import { toast } from '@/common';
import { Button, Header, FieldSet, Label, Input } from '@/components';
import Line from '@/components/Line';
import { GlobalAuth, GlobalEmail, GlobalLanguage, GlobalModules, GlobalNMS, GlobalNotifications, GlobalPages, GlobalRole, GlobalUser, GuestStrings } from '@/model';
import { ModuleClass } from '@/model/classes';
import { ModuleModel } from '@/model/types';
import { ResetPasswordService } from '@/service';
import { RecoverService } from '@/service/RecoverService';
import { LoginResponse, RecoverPayload, ResetPasswordPayload } from '@/service/types';
import React, { useState, useEffect, useRef } from 'react';

const Verify = ({ innerPage, navigate, defaultPayload }: { innerPage: Function, navigate: Function, defaultPayload: RecoverPayload }) => {
    const [sent, setSent] = useState(false);
    const [timeInSeconds, setTimeInSeconds] = useState(0);
    const codeRef = useRef<HTMLInputElement>(null);
    const [strings, setStrings] = useState<Record<string, string>>({});
    const [disabled1, setDisabled1] = useState(false);
    const [disabled2, setDisabled2] = useState(false);

    useEffect(() => {
        setStrings(GuestStrings.getAll());
        const updateTimer = () => {
            setTimeInSeconds((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timerInterval);
                    setSent(false);
                    return 0;
                }
            });
        }
        const timerInterval = setInterval(updateTimer, 1000);
        return () => clearInterval(timerInterval);
    }, []);

    function formatTime(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function submit() {
        const temp_pwd = codeRef.current?.value ?? "";
        if (temp_pwd === "") return;
        setDisabled1(true);
        const payload: ResetPasswordPayload = {
            temp_pwd: temp_pwd,
            email: defaultPayload.email,
        }
        ResetPasswordService(payload).then((response: LoginResponse) => {
            if (response !== null) {
                const modules: ModuleModel[] = [];
                response.modules.map((m, i) => {
                    modules.push(new ModuleClass(m, i === 0));
                });
                GlobalModules.set(modules);
                GlobalRole.set(response.roles);
                GlobalUser.set(response.name);
                GlobalEmail.set(defaultPayload.email);
                GlobalAuth.set(response.access);
                GlobalNMS.set(response.nms);
                GlobalLanguage.set(response.language);
                const promises: Promise<void>[] = [];
                promises.push(GlobalPages.set(response.pages));
                promises.push(GlobalNotifications.clear());
                Promise.all(promises).then(() => window.location.href = "/");
            }
        }).finally(() => {
            setDisabled1(false);
        });
    }

    function resend() {
        setDisabled2(true);
        const payload: RecoverPayload = {
            email: defaultPayload.email
        }
        RecoverService(payload).then(response => {
            if (response !== null) {
                toast(strings?.mailSent);
            }
        }).finally(() => {
            setDisabled2(false);
        });
    }

    return (
        <div className="w-[24rem] mx-auto flex flex-col space-y-6">
            <Header>{strings?.verifyAccount}</Header>
            <FieldSet direction='column'>
                <Label>{strings?.code}</Label>
                <Input.Line ref={codeRef} />
            </FieldSet>
            <div className='flex flex-col space-y-3'>
                <Button variant='contained' onClick={submit} disabled={disabled1}>
                    {strings?.submit}
                </Button>
                <Line />
                <Button variant='outlined' onClick={!sent ? resend : async () => {}} disabled={disabled2}>
                    {sent ? `${strings?.resend}: ${formatTime(timeInSeconds)}` : `${strings?.resend}`}
                </Button>
                <Button color='error' variant='outlined' onClick={() => navigate(0)}>
                    {strings?.cancel}
                </Button>
            </div>
        </div>
    );
}

export default Verify;