'use client';

import { getSessionId, joinList, safeLogout, validateString, toast, validateAllKeys } from '@/common';
import { Button, FieldSet, Header, Input, Label, Paragraph, SubHeader } from '@/components';
import { GlobalModules, GlobalLanguage, GlobalUser, GlobalEmail, GlobalNMS, GlobalPages, GlobalRole } from '@/model';
import { UpdatePasswordService, UpdateLanguageService, UpdateNMSService, CompleteLogoutService } from '@/service';
import { CompleteLogoutPayload, DefaultResponse, UpdateLanguagePayload, UpdateLanguageResponse, UpdateNMSPayload, UpdatePasswordPayload } from '@/service/types';
import React, { useState, useEffect, useRef } from 'react';
import { LanguageKey } from '@/asset/language';
import Line from '@/components/Line';

const Settings = () => {
    const [isClient, setIsClient] = useState(false);
    const [defaultLanguage, setDefaultLanguage] = useState("");
    const [languages, setLanguages] = useState<Record<LanguageKey, string>>();
    const enableNMSRef = useRef<HTMLInputElement>(null);
    const currentPasswordRef = useRef<HTMLInputElement>(null);
    const newPasswordRef = useRef<HTMLInputElement>(null);
    const validatePasswordRef = useRef<HTMLInputElement>(null);
    const logoutPasswordRef = useRef<HTMLInputElement>(null);
    const [strings, setStrings] = useState<Record<string, string>>({});
    const [disabled1, setDisabled1] = useState(false);
    const [disabled2, setDisabled2] = useState(false);
    const [disabled3, setDisabled3] = useState(false);
    const [disabled4, setDisabled4] = useState(false);

    useEffect(() => {
        if (!getSessionId()) window.location.href = "/";
        // dynamic import list of languages supported
        import("@/asset/language/language.json").then(response => {
            setLanguages(response.default);
            setDefaultLanguage(response.default[GlobalLanguage.get()]);
        });
        import(`@/asset/strings/me/${GlobalLanguage.get()}.json`).then(res => {
            setStrings(res.default);
            setIsClient(true);
        });
    }, []);

    function updatePassword() {
        const currentPassword = currentPasswordRef.current?.value ?? "";
        const newPassword = newPasswordRef.current?.value ?? "";
        const validatePassword = validatePasswordRef.current?.value ?? "";
        if (!(
            validateString(currentPassword) &&
            validateString(newPassword) &&
            validateString(validatePassword)
        )) {
            return;
        }
        if (currentPassword === newPassword) {
            toast(strings?.samePassword);
            return;
        }
        if (newPassword !== validatePassword) {
            toast(strings?.passwordsDoNotMatch);
            return;
        }
        if (newPassword.length < 8) {
            toast(strings?.passwordShouldBe);
            return;
        }
        setDisabled3(true);
        const payload: UpdatePasswordPayload = {
            'password': newPassword
        }
        UpdatePasswordService(payload).then((response: DefaultResponse) => {
            if (response !== null) toast(strings?.updated);
        }).finally(() => {
            setDisabled3(false);
        });
    }

    function updateLanguage(e: any) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const language = formData.get("language") as string;
        const payload: UpdateLanguagePayload = {
            'language': language
        }
        if (!validateAllKeys(payload)) return;
        const newLang = languages && Object.keys(languages).find(l => languages[l as LanguageKey] === language);
        if (!newLang) safeLogout();
        setDisabled1(true);
        UpdateLanguageService(payload).then((response: UpdateLanguageResponse) => {
            if (response !== null) {
                toast(strings?.updated);
                setDefaultLanguage(language as LanguageKey);
                GlobalLanguage.set(newLang as LanguageKey);
            }
        }).finally(() => {
            setDisabled1(false);
        });
    }

    function updateNMS() {
        setDisabled2(true);
        const action = enableNMSRef.current?.checked ?? false;
        const payload: UpdateNMSPayload = {
            action: action
        }
        UpdateNMSService(payload).then(response => {
            if (response !== null ) {
                toast(strings?.updated);
                GlobalNMS.set(action);
            }
        }).finally(() => {
            setDisabled2(false);
        });
    }

    function logout() {
        setDisabled4(true);
        const password = logoutPasswordRef?.current?.value ?? "";
        if (password !== "") {
            const payload: CompleteLogoutPayload = {
                password: password
            }
            CompleteLogoutService(payload).then(response => {
                if (response !== null) {
                    sessionStorage.clear();
                    localStorage.clear();
                    const promises: Promise<void>[] = [
                        GlobalPages.clear(),
                    ];
                    Promise.all(promises).then(_ => {
                        window.location.href = "/";
                    });
                }
            }).finally(() => {
                setDisabled4(false);
            });
        } else {
            safeLogout(() => setDisabled4(false));
        }
    }

    const Container = ({children}: {children: React.ReactNode}) => (
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 lg:space-x-8">
            {children}
        </div>
    )

    const LeftChild = ({children}: {children: React.ReactNode}) => (
        <div className="flex flex-col space-y-3 w-full sm:w-1/2 md:w-1/3">
            {children}
        </div>
    )

    const RightChild = ({children}: {children: React.ReactNode}) => (
        <div className="flex flex-col space-y-3 w-full sm:w-1/2 md:w-2/3">
            {children}
        </div>
    )
    
    return (
        isClient && (
            <div className="w-full sm:w-[90vw] md:w-[75vw] lg:w-[60vw] xl:w-[50vw] mx-auto flex flex-col space-y-6 sm:space-y-4 py-6 sm:py-8 md:py-10 px-3">
                <Header textAlign='left'>{strings?.settings}</Header>
                <Line />
                <Container>
                    <LeftChild>
                        <SubHeader textAlign='left'>{strings?.personal}</SubHeader>
                        <Paragraph>{strings?.youCanRetrieve}</Paragraph>
                    </LeftChild>
                    <RightChild>
                        <FieldSet direction='column'>
                            <Label>{strings?.profile}</Label>
                            <Input.Line defaultValue={GlobalRole.get()?.profile_name} disabled={true} />
                        </FieldSet>
                        <FieldSet direction='column'>
                            <Label>{strings?.modules}</Label>
                            <Input.Line value={joinList(GlobalModules.get()?.map(m => m.name))} disabled />
                        </FieldSet>
                        <FieldSet direction='column'>
                            <Label>{strings?.name}</Label>
                            <Input.Line defaultValue={GlobalUser.get()} disabled={true} />
                        </FieldSet>
                        <FieldSet direction='column'>
                            <Label>{strings?.email}</Label>
                            <Input.Line defaultValue={GlobalEmail.get()} disabled={true} />
                        </FieldSet>
                    </RightChild>
                </Container>
                <Line />
                <Container>
                    <LeftChild>
                        <SubHeader textAlign='left'>{strings?.language}</SubHeader>
                        <Paragraph>{strings?.setUpYourApplication}</Paragraph>
                    </LeftChild>
                    <RightChild>
                        <form onSubmit={updateLanguage}>
                            <FieldSet direction='column'>
                                <Label>{strings?.language}</Label>
                                <Input.Select
                                name="language"
                                value={defaultLanguage}
                                options={languages && Object.keys(languages).map((l: string) => {
                                    return {
                                        'label': languages[l as LanguageKey],
                                        'value': l
                                    }
                                }) || []}>
                                </Input.Select>
                            </FieldSet>
                            <div className="flex">
                                <div className="ml-auto">
                                    <Button variant='contained' type="submit" disabled={disabled1}>{strings?.save}</Button>
                                </div>
                            </div>
                        </form>
                    </RightChild>
                </Container>
                <Line />
                <Container>
                    <LeftChild>
                        <SubHeader textAlign='left'>{strings?.notifications}</SubHeader>
                        <Paragraph>{strings?.manageYourNotifications}</Paragraph>
                    </LeftChild>
                    <RightChild>
                        <FieldSet direction='column'>
                            <Label>{strings?.enableNotifications}</Label>
                            <Input.Checkbox ref={enableNMSRef} checked={GlobalNMS.get()} />
                            <Label>{strings?.onceActivated}</Label>
                        </FieldSet>
                        <div className="flex">
                            <div className="ml-auto">
                                <Button variant='contained' onClick={() => updateNMS()} disabled={disabled2}>{strings?.save}</Button>
                            </div>
                        </div>
                    </RightChild>
                </Container>
                <Line />
                <Container>
                    <LeftChild>
                        <SubHeader textAlign='left'>{strings?.changePassword}</SubHeader>
                        <Paragraph>{strings?.updateYourPassword}</Paragraph>
                    </LeftChild>
                    <RightChild>
                        <FieldSet direction='column'>
                            <Label>{strings?.currentPassword}</Label>
                            <Input.Line type='password' ref={currentPasswordRef} />
                        </FieldSet>
                        <FieldSet direction='column'>
                            <Label>{strings?.newPassword}</Label>
                            <Input.Line type='password' ref={newPasswordRef} />
                        </FieldSet>
                        <FieldSet direction='column'>
                            <Label>{strings?.confirmPassword}</Label>
                            <Input.Line type='password' ref={validatePasswordRef} />
                        </FieldSet>
                        <div className="flex">
                            <div className="ml-auto">
                                <Button variant='contained' onClick={() => updatePassword()} disabled={disabled3}>{strings?.save}</Button>
                            </div>
                        </div>
                    </RightChild>
                </Container>
                <Line />
                <Container>
                    <LeftChild>
                        <SubHeader textAlign='left'>{strings?.logOutFromAllDevices}</SubHeader>
                        <Paragraph>{strings?.pleaseEnterYourPassword}</Paragraph>
                    </LeftChild>
                    <RightChild>
                        <FieldSet direction='column'>
                            <Label>{strings?.password}</Label>
                            <Input.Line type='password' ref={logoutPasswordRef} />
                        </FieldSet>
                        <div className="flex">
                            <div className="ml-auto">
                                <Button variant='contained' onClick={() => logout()} disabled={disabled4}>{strings?.logout}</Button>
                            </div>
                        </div>
                    </RightChild>
                </Container>
            </div>
        )
    );
}

export default Settings