"use client";

import { FieldSet, Header, Input, Label, Button } from '@/components';
import { GlobalModules, GlobalPages, GlobalRole, GlobalAuth, GlobalToken, GlobalUser, GlobalEmail, GuestStrings, GlobalLanguage, GlobalNMS, GlobalNotifications } from '@/model';
import { LoginService } from '@/service';
import React, { useEffect, useRef, useState } from 'react';
import { LoginPayload, LoginResponse } from '@/service/types'
import { validateString } from '@/common';
import Line from '@/components/Line';
import { ModuleModel } from '@/model/types';
import { ModuleClass } from '@/model/classes';

const Login = ({ navigate }: { navigate: Function }) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const rememberRef = useRef<HTMLInputElement>(null);
    const [strings, setStrings] = useState<Record<string, string>>({});
    const [disabled1, setDisabled1] = useState(false);

    useEffect(() => {
        setStrings(GuestStrings.getAll());
    }, []);

    function submit() {
        const email = emailRef.current?.value ?? "";
        const password = passwordRef.current?.value ?? "";
        if (!(validateString(email) && validateString(password))) return;
        const remember = rememberRef.current?.checked ?? false;
        const payload: LoginPayload = {
            email: email,
            password: password,
            remember: remember
        }
        setDisabled1(true);
        LoginService(payload).then((response: LoginResponse) => {
            if (response !== null) {
                const modules: ModuleModel[] = [];
                response.modules.map((m, i) => {
                    modules.push(new ModuleClass(m, i === 0));
                });
                GlobalModules.set(modules);
                GlobalRole.set(response.roles);
                GlobalUser.set(response.name);
                GlobalEmail.set(email);
                GlobalAuth.set(response.access);
                GlobalNMS.set(response.nms);
                GlobalLanguage.set(response.language);
                if (remember) GlobalToken.set(response.access);
                const promises: Promise<void>[] = [];
                promises.push(GlobalPages.set(response.pages));
                Promise.all(promises).then(() => window.location.href = "/");
            }
        }).finally(() => {
            setDisabled1(false);
        });
    }

    function loginAsGuest() {
        setDisabled1(true);
        const email = "guest@email.com";
        const payload: LoginPayload = {
            email: email,
            password: "password123",
            remember: false
        }
        LoginService(payload).then((response: LoginResponse) => {
            if (response !== null) {
                const modules: ModuleModel[] = [];
                response.modules.map((m, i) => {
                    modules.push(new ModuleClass(m, i === 0));
                });
                GlobalModules.set(modules);
                GlobalRole.set(response.roles);
                GlobalUser.set(response.name);
                GlobalEmail.set(email);
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

    return (
        <div className="w-[24rem] mx-auto flex flex-col space-y-6">
            <Header>{strings?.loginToTeam}</Header>
            <div className='flex flex-col space-y-2'>
                <FieldSet direction='column'>
                    <Label>{strings?.email}</Label>
                    <Input.Line ref={emailRef} />
                </FieldSet>
                <FieldSet direction='column'>
                    <Label>{strings?.password}</Label>
                    <Input.Line ref={passwordRef} type='password' />
                </FieldSet>
                <div className='flex flex-row items-center justify-between'>
                    <div className="flex flex-row items-center space-x-2">
                        <Label>{strings?.rememberMe}</Label>
                        <input type='checkbox' ref={rememberRef} />
                    </div>
                    <div className='text-right'>
                        <small className='text-sm font-medium underline cursor-pointer' onClick={() => navigate(1)}>{strings?.forgot}</small>
                    </div>
                </div>
            </div>
            <div className='flex flex-col space-y-3'>
                <Button variant='contained' onClick={submit} disabled={disabled1}>{strings?.login}</Button>
                <Line />
                <Button variant='outlined' onClick={loginAsGuest} disabled={disabled1}>{strings?.trial}</Button>
            </div>
        </div>
    );
}

export default Login;