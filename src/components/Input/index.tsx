'use client';

import { ForwardedRef, LegacyRef, useEffect, useState } from "react";
import { formatNumber, hasRole, joinList, prepareFile, show, stringifyConditions, validateAllKeys, validateNumber } from "@/common";
import { Editor, Filter, Label, SearchView } from "@/components";
import React from "react";
import { GlobalCurrency, GlobalStrings } from "@/model";
import { ConditionModel, ReferenceModel, FileModel, OptionModel } from "@/model/types";
import { CurrencyKey } from "@/asset/currency";
import { FileElement, InputElement, InputProps, NumberElement, SelectElement, TextareaElement } from "./InputProps";
import { FileClass, ReferenceClass } from "@/model/classes";

export const Input = () => {}

interface InputDateProps extends InputProps, InputElement {}

Input.Date = React.forwardRef<HTMLInputElement, InputDateProps>((
    { defaultValue, value, placeholder, disabled, max, min, required, onChange, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        setInput(value ?? defaultValue ?? "");
    }, [value, defaultValue]);

    function handleOnChange(val: string) {
        setInput(val);
        if (onChange) onChange({[name ?? ""]: val});
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <input
                ref={ref}
                onChange={(event) => handleOnChange(event.target.value)}
                value={input}
                placeholder={placeholder}
                type='date'
                disabled={disabled ?? false}
                max={max}
                min={min}
                className={`${disabled && "hover:cursor-not-allowed"}`}
                name={name}
                id={id}
                autoComplete="off"
                required={required}
                style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    );
});

interface InputDatetimeProps extends InputProps, InputElement {}

Input.DateTime = React.forwardRef<HTMLInputElement, InputDatetimeProps>((
    { defaultValue, value, placeholder, disabled, max, min, required, onChange, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        setInput(value ?? defaultValue ?? "");
    }, [value, defaultValue]);

    function handleOnChange(val: string) {
        setInput(val);
        if (onChange) onChange({[name ?? ""]: val});
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <input
                ref={ref}
                onChange={(event) => handleOnChange(event.target.value)}
                value={input}
                placeholder={placeholder}
                type='datetime-local'
                disabled={disabled ?? false}
                max={max}
                min={min}
                autoComplete="off"
                id={id}
                name={name}
                required={required}
                className={`${disabled && "hover:cursor-not-allowed"}`}
                style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    )
})

interface InputLineProps extends InputProps, InputElement {
    type?: 'text' | 'password' | 'email' | "url";
}

Input.Line = React.forwardRef<HTMLInputElement, InputLineProps>((
    { defaultValue, value, placeholder, disabled, maxLength, required, onChange, type, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        setInput(value ?? defaultValue ?? "");
    }, [value, defaultValue]);

    function handleOnChange(val: string) {
        setInput(val);
        if (onChange) onChange({[name ?? ""]: val});
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <input
                ref={ref}
                onChange={(event) => handleOnChange(event.target.value)} 
                value={input}
                placeholder={placeholder}
                type={type ?? 'text'}
                maxLength={maxLength}
                required={required}
                className={`${disabled && "hover:cursor-not-allowed"}`}
                id={id}
                autoComplete="off"
                disabled={disabled ?? false}
                name={name}
                style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    )}
)

interface InputQuantityProps extends InputProps, NumberElement {
    decimals?: number;
}

Input.Quantity = React.forwardRef<HTMLInputElement, InputQuantityProps>((
    { defaultValue, value, placeholder, disabled, max, min, decimals, required, onChange, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const [input, setInput] = useState('');
    const [defaultInput, setDefaultInput] = useState('');

    useEffect(() => {
        if (value) setInput(formatNumber(value.toString()));
        if (defaultValue) setDefaultInput(formatNumber(defaultValue.toString()));
    }, [value, defaultValue]);

    function handleChange(input: string) {
        const number = parseFloat(input);
        const validation = validateNumber(number, max, min, decimals);
        if (validation === "pass") {
            setError("");
            if (onChange) onChange({[name ?? ""]: number});
            setInput(formatNumber(input));
        } else {
            setError(validation);
        }
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <input
                ref={ref}
                onChange={(event) => {handleChange(event.target.value)}}
                placeholder={placeholder}
                disabled={disabled ?? false}
                value={input}
                defaultValue={defaultInput}
                id={id}
                type="text"
                className={`${disabled && "hover:cursor-not-allowed"}`}
                name={name}
                autoComplete="off"
                required={required}
                style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    )}
)

interface InputMultilineProps extends InputProps, TextareaElement {
    maxLines?: number;
    defaultValue?: string;
}

Input.Multiline = React.forwardRef<HTMLTextAreaElement, InputMultilineProps>((
    { defaultValue, value, placeholder, disabled, maxLength, maxLines, required, onChange, name, id }, ref?: React.LegacyRef<HTMLTextAreaElement>
) => {
    const [error, setError] = useState('');
    const [input, setInput] = useState("");

    useEffect(() => {
        setInput(value ?? defaultValue ?? "");
    }, [value, defaultValue]);

    function handleOnChange(val: string) {
        setInput(val);
        if (onChange) onChange({[name ?? ""]: val});
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <textarea
                ref={ref}
                onChange={(event) => handleOnChange(event.target.value)}
                placeholder={placeholder}
                disabled={disabled ?? false}
                maxLength={maxLength}
                value={input}
                rows={maxLines ?? 4}
                autoComplete="off"
                id={id}
                name={name}
                required={required}
                className={`${disabled && "hover:cursor-not-allowed"}`}
                style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    )}
);

interface InputSelectProps extends InputProps, InputElement {
    options: OptionModel[];
    textAlign?: 'center' | 'left' | 'right';
    defaultValue?: string;
    value?: string;
}

Input.Select = React.forwardRef<HTMLInputElement, InputSelectProps>((
    { defaultValue, value, required, disabled, onChange, options, name, id, textAlign = 'left' }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [defaultInput, setDefaultInput] = useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) setSearch(value);
        if (defaultValue) setDefaultInput(defaultValue);
    }, [value, defaultValue]);

    function handleToggle() {
        if (isOpen && !options.map(o => o.label ?? o.value).includes(search)) {
            setSearch("");
        }
        setIsOpen(!isOpen);
    }

    function handleClose(e: React.FocusEvent<HTMLInputElement, Element>) {
        if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
            handleToggle();
        }
    }

    function handleOptionClick(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        setSearch(e.currentTarget.textContent ?? "");
        if (onChange) onChange({[name ?? ""]: e.currentTarget.textContent ?? ""});
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]" ref={containerRef}>
            <input
            type="text"
            ref={ref}
            value={search}
            defaultValue={defaultInput}
            autoComplete="off"
            onChange={(e) => handleOnChange(e)}
            disabled={disabled ?? false}
            name={name}
            id={id}
            required={required}
            className={`${disabled && "hover:cursor-not-allowed w-full"} text-${textAlign}`}
            onClick={() => handleToggle()}
            onBlur={(e) => handleClose(e)}
            style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            <ul>
                <li className="relative">
                    { isOpen && (
                        <ul className="absolute bg-background dark:bg-foreground z-10 w-full border border-neutralDark rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                            {options.filter(o => o.value.toLowerCase().includes(search.toLowerCase())).map((option: OptionModel) => (
                                <li
                                key={option.value}
                                className="p-2 cursor-pointer hover:bg-hoverTint dark:hover:bg-hoverTintDark"
                                onMouseDown={(e) => handleOptionClick(e)}
                                >
                                {option.label ?? option.value}
                                </li>
                            ))}
                        </ul>
                    ) }
                </li>
            </ul>
            {required && <span>{GlobalStrings.get("dashboard", "required")}</span>}
            <span className="text-error">{error}</span>
        </div>
    )}
);

interface InputMultiSelectProps extends SelectElement {
    options: OptionModel[];
    textAlign?: 'center' | 'left' | 'right';
    defaultValue?: string[];
    value?: string[];
    onChange?: ((e: Record<string, string[]>) => void);
}

Input.MultiSelect = React.forwardRef<HTMLInputElement, InputMultiSelectProps>((
    { defaultValue, value, required, disabled, onChange, options, name, id, textAlign = 'left' }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string[]>(value ?? defaultValue ?? []);
    const [search, setSearch] = useState(joinList(selectedOption));

    useEffect(() => {

    }, [value, defaultValue]);

    function handleOptionClick(e: React.ChangeEvent<HTMLInputElement>) {
        let newSelectedOption: string[] = selectedOption;
        if (e.target.checked) {
            newSelectedOption.push(e.target.value);
        } else {
            newSelectedOption.filter(o => o !== e.target.value);
        }
        setSelectedOption(newSelectedOption);
        if (onChange) onChange({[name ?? ""]: newSelectedOption});
    };

    function handleClose() {
        if (isOpen) setSearch(joinList(selectedOption));
        setIsOpen(!isOpen);
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value);
    }

    function handleOnBlur(e: React.FocusEvent<HTMLInputElement | HTMLUListElement, Element>) {
        if (e.relatedTarget === null) {
            setSearch(joinList(selectedOption));
            setIsOpen(false);
        }
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <input
            type="text"
            ref={ref}
            value={search}
            onFocus={() => setSearch("")}
            onChange={(e) => handleOnChange(e)}
            onBlur={(e) => handleOnBlur(e)}
            disabled={disabled ?? false}
            name={name}
            autoComplete="off"
            id={id}
            required={required}
            className={`${disabled && "hover:cursor-not-allowed w-full"} text-${textAlign}`}
            onClick={() => handleClose()}
            style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            <ul onBlur={(e) => handleOnBlur(e)}>
                <li className="relative">
                    { isOpen && (
                        <ul className="absolute bg-background dark:bg-foreground z-10 w-full border border-neutralDark rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                            {options.filter(o => o.value.toLowerCase().includes(search.toLowerCase())).map((option: OptionModel) => (
                                <li key={option.value} className="p-2">
                                    <div className="flex flex-row items-center space-x-2">
                                        <input type='checkbox' value={option.value} onChange={(e) => handleOptionClick(e)} checked={selectedOption.includes(option.value)} />
                                        <Label>{option.label ?? option.value}</Label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) }
                </li>
            </ul>
            {required && <span>{GlobalStrings.get("dashboard", "required")}</span>}
            <span className="text-error">{error}</span>
        </div>
    )}
);

interface InputFileProps extends FileElement {
    size?: number;
    types?: string[];
    preview?: boolean;
}

Input.File = React.forwardRef<HTMLInputElement, InputFileProps>((
    { defaultValue, value, placeholder, disabled, required, onChange, id, name, size, types, preview = false, maxLength }, ref: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<FileModel>();
    const [originalFile, setOriginalFile] = useState<FileModel | undefined>();
    const fileTypes: Record<string, string> = {
        ".jpg": "image/jpg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".pdf": "application/pdf"
    }
    const maxFileSize = size ? size * 1024 * 1024 : 5 * 1024 * 1024;

    useEffect(() => {
        setFile(value ?? defaultValue ?? new FileClass());
        setOriginalFile(value ?? defaultValue);
    }, [defaultValue, value]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.key === "Backspace") {
            setFile(new FileClass());
        }
    }

    function openFileDialog() {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        document.body.style.cursor = 'progress';
        const newFile: FileModel = new FileClass();
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = types ? types.map(t => { return fileTypes[t] ?? "" }).filter(t => t !== "") : Object.values(fileTypes);
            if (!validTypes.includes(file.type)) {
                setError(GlobalStrings.get("error", "unallowedFileType"));
                return;
            }
            if (file.size > maxFileSize) {
                setError(GlobalStrings.get("error", "unallowedFileSize"));
                return;
            }
            if (maxLength && file.name.length > maxLength) {
                setError(GlobalStrings.get("error", "unallowedFileNameLength"));
                return;
            }
            setError("");
            newFile.name = file.name;
            newFile.url = await prepareFile(file);
            setFile(newFile);
        }
        if (onChange) onChange({[name ?? ""]: newFile});
        document.body.style.cursor = 'default';
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <div className="flex flex-row gap-1">
                {
                    originalFile && (
                        <span className="mt-[4.5px]" onClick={() => window.open(originalFile.url as string, '_blank')}>
                            <img src="/icons/link.svg" width={20} height={20} className='dark:invert' />
                        </span>
                    )
                }
                <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e)}
                accept={types ? joinList(types) : ".jpg,.jpeg,.png,.pdf"}
                name={name}
                id={id}
                />
                <input
                    type="text"
                    onClick={() => !disabled && openFileDialog()}
                    value={file?.name}
                    contentEditable={false}
                    disabled={disabled ?? false}
                    className={`${disabled && "hover:cursor-not-allowed"}`}
                    required={required}
                    onKeyDown={(e) => handleKeyDown(e)}
                    autoComplete="off"
                    placeholder={placeholder}
                    style={{ flex: 2, borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
                />
            </div>
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
            {
                preview && (
                    <div
                    className="w-[70px] h-[70px] bg-center bg-contain bg-no-repeat"
                    style={{ backgroundImage: `url(${file ? file.name : '/icons/image-container.svg'})` }}
                    />
                )
            }
        </div>
    );
})

interface InputMoneyProps extends InputProps, NumberElement {
    currency: CurrencyKey;
    decimals?: number;
}

Input.Money = React.forwardRef<HTMLInputElement, InputMoneyProps>((
    { defaultValue, value, placeholder, disabled, min,  max, currency, decimals, required, onChange, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const [input, setInput] = useState('');
    const [defaultInput, setDefaultInput] = useState('');
    
    useEffect(() => {
        if (value) setInput(formatNumber(value.toString()));
        if (defaultValue) setDefaultInput(formatNumber(defaultValue.toString()));
    }, [value, defaultValue]);

    function handleChange(input: string) {
        const number = parseFloat(input);
        const validation = validateNumber(number, max, min, decimals);
        if (validation === "pass") {
            setError("");
            if (onChange) onChange({[name ?? ""]: number});
            setInput(formatNumber(input));
        } 
        else setError(validation);
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <div className="flex relative items-center" style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}>
                <span className="absolute left-3 text-darkGray dark:neutral">{GlobalCurrency.get(currency)}</span>
                <input
                    ref={ref}
                    onChange={(event) => {handleChange(event.target.value)}}
                    type='number'
                    required={required}
                    value={input}
                    defaultValue={defaultInput}
                    id={id}
                    autoComplete="off"
                    placeholder={placeholder}
                    disabled={disabled ?? false}
                    min={min}
                    max={max}
                    name={name}
                    className={`${disabled && "hover:cursor-not-allowed"} pl-6 flex-1`}
                />
            </div>
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    )}
);

interface InputPercentProps extends InputProps, NumberElement {
    decimals?: number;
}

Input.Percent = React.forwardRef<HTMLInputElement, InputPercentProps>((
    { defaultValue, value, placeholder, disabled, decimals, required, onChange, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const [input, setInput] = useState('');
    const [defaultInput, setDefaultInput] = useState('');

    useEffect(() => {
        if (value) setInput(formatNumber(value.toString()));
        if (defaultValue) setDefaultInput(formatNumber(defaultValue.toString()));
    }, [value, defaultValue]);

    function handleChange(input: string) {
        const number = parseFloat(input);
        const validation = validateNumber(number, 100, 0, decimals);
        if (validation === "pass") {
            setError("");
            setInput(formatNumber(input));
            if (onChange) onChange({[name ?? ""]: number});
        } else setError(validation);
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <div className="flex relative items-center" style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}>
                <input
                    ref={ref}
                    onChange={(event) => {handleChange(event.target.value)}}
                    type='text'
                    value={input}
                    defaultValue={defaultInput}
                    placeholder={placeholder}
                    id={id}
                    autoComplete="off"
                    required={required}
                    disabled={disabled ?? false}
                    className={`${disabled && "hover:cursor-not-allowed"} pr-6 flex-1`}
                    name={name}
                />
                <span className="absolute right-3 text-darkGray dark:neutral">%</span>
            </div>
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    )}
);

interface InputConditionsProps extends InputProps {
    defaultValue?: ConditionModel[];
    pageId: string;
    onChange?: ((e: Record<string, ConditionModel[]>) => void);
    id?: string;
    value?: ConditionModel[];
}

Input.Conditions = React.forwardRef<HTMLTextAreaElement, InputConditionsProps>((
    { defaultValue, required, pageId, onChange, disabled, name, id, value }, ref?: LegacyRef<HTMLTextAreaElement>
) => {
    const [error, setError] = useState('');
    const [input, setInput] = useState<ConditionModel[]>([]);

    useEffect(() => {
        if (value) setInput(value);
        else if (defaultValue) setInput(defaultValue);
    }, [defaultValue, value]);

    function openModal() {
        show(
            <Filter pageId={pageId} defaultValue={input}>
                <Filter.Preview editable={!disabled} />
                <Filter.ButtonGroup>
                    <Filter.Add />
                    <Filter.Save onClick={handleSetValue} />
                </Filter.ButtonGroup>
            </Filter>, 'medium'
        );
    }

    function handleSetValue(value: ConditionModel[]) {
        setInput(value);
        if (onChange) onChange({[name ?? ""]: value});
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <div className="flex flex-row gap-1">
                <span className="mt-[4.5px] cursor-pointer" onClick={() => openModal()}>
                    <img src="/icons/link.svg" width={20} height={20} className='dark:invert' />
                </span>
                <textarea
                    id={id}
                    ref={ref}
                    disabled={disabled ?? false}
                    className={`${disabled && "hover:cursor-not-allowed"}`}
                    value={stringifyConditions(input)}
                    autoComplete="off"
                    cols={4}
                    required={required}
                    name={name}
                    style={{ flex: 2, borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
                />
            </div>
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    );
});

interface InputReferenceProps extends InputProps {
    defaultValue?: ReferenceModel;
    onChange?: ((e: Record<string, ReferenceModel>) => void);
    page: ReferenceModel;
    id?: string;
    placeholder?: ReferenceModel;
}

Input.Reference = React.forwardRef<HTMLInputElement, InputReferenceProps>((
    { defaultValue, disabled, required, onChange, page, name, placeholder, id }, ref?: ForwardedRef<HTMLInputElement>,
) => {
    const [error, setError] = useState('');
    const [value, setValue] = useState<ReferenceModel>(new ReferenceClass());

    function openModal() {
        show(
            <SearchView
            pageId={page._id}
            placeholder={GlobalStrings.get("dashboard", "searchText")}
            onClick={handleSetValue}
            hasRole={hasRole("read_role", page.name)}
            />
        );
    }

    function handleSetValue(newValue: ReferenceModel) {
        if (onChange) onChange({[name ?? ""]: newValue});
        setValue(newValue);
    }

    useEffect(() => {
        if (defaultValue) setValue(defaultValue);
    }, [defaultValue]);

    function handleFocus(_e: React.FocusEvent<HTMLInputElement, Element>) {
        if (!disabled && placeholder !== undefined) {
            if (onChange) onChange({[name ?? ""]: placeholder});
            setValue(placeholder);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        e.preventDefault();
        if (e.key === "Backspace") {
            setValue(new ReferenceClass());
        }
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <div className="flex flex-row gap-1">
                <span className="mt-[4.5px]" onClick={() => !disabled && openModal()} style={{ cursor: !disabled ? "pointer" : "not-allowed"}}>
                    <img src="/icons/link.svg" width={20} height={20} className='dark:invert' />
                </span>
                <input
                    id={id}
                    value={validateAllKeys(value) ? value.name : ''}
                    contentEditable={false}
                    disabled={disabled ?? false}
                    className={`${disabled && "hover:cursor-not-allowed"}`}
                    type="text"
                    autoComplete="off"
                    required={required}
                    onKeyDown={(e) => handleKeyDown(e)}
                    ref={ref}
                    name={name}
                    placeholder={placeholder && validateAllKeys(placeholder) ? placeholder.name : ''}
                    onFocus={(e) => handleFocus(e)}
                    style={{ flex: 2, borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
                />
            </div>
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    );
});

interface InputCheckboxProps extends InputProps {
    defaultChecked?: boolean;
    onChange?: ((e: Record<string, boolean>) => void);
    checked?: boolean;
    id?: string;
}

Input.Checkbox = React.forwardRef<HTMLInputElement, InputCheckboxProps>((
    { defaultChecked, checked, disabled, required, onChange, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const [input, setInput] = useState(false);
    const [defaultInput, setDefaultInput] = useState(false);

    useEffect(() => {
        setDefaultInput(defaultChecked ?? false);
        setInput(checked ?? false);
    }, [defaultChecked, checked]);

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (onChange) onChange({[name ?? ""]: e.target.checked});
        setInput(e.target.checked);
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <input
                ref={ref as React.Ref<HTMLInputElement> | undefined}
                type="checkbox"
                checked={input}
                defaultChecked={defaultInput}
                id={id}
                className={`${disabled && "hover:cursor-not-allowed"}`}
                disabled={disabled}
                name={name}
                required={required}
                autoComplete="off"
                onChange={handleOnChange}
            />
            {required && <span>{GlobalStrings.get("dashboard", "required")}</span>}
            <span className="text-error">{error}</span>
        </div>
    );
});

interface InputScriptProps extends InputProps {
    defaultValue?: string;
    standard?: boolean;
    onChange?: ((e: Record<string, string>) => void);
    id?: string;
}

Input.Script = React.forwardRef<HTMLTextAreaElement, InputScriptProps>((
    { defaultValue, standard, required, disabled, onChange, name, id }, ref?: React.LegacyRef<HTMLTextAreaElement>
) => {
    const [error, setError] = useState('');
    const testRef = React.useRef(false);
    const [value, setValue] = useState('');

    useEffect(() => {
        if (value === "") return;
        testRef.current = true;
    }, [value, defaultValue]);

    function openEditor() {
        show(<Editor value={defaultValue} setValue={handleSetValue} />, 'big');
    }

    function handleSetValue(input: string) {
        setValue(input);
        if (onChange) onChange({[name ?? ""]: input});
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <div className="flex flex-row gap-1">
                <span className="mt-[4.5px]" onClick={() => !(disabled ?? standard) && openEditor()} style={{ cursor: !(disabled ?? standard) ? "pointer" : "not-allowed"}}>
                    <img src="/icons/link.svg" width={20} height={20} className='dark:invert' />
                </span>
                <textarea
                    id={id}
                    ref={ref}
                    value={standard ? GlobalStrings.get("dashboard", "standardScript") : (testRef.current ? value : defaultValue ?? GlobalStrings.get("dashboard", 'initialInput'))}
                    cols={4}
                    autoComplete="off"
                    required={required}
                    className={`${disabled && "hover:cursor-not-allowed"}`}
                    name={name}
                    style={{ flex: 2, borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
                />
            </div>
            { required && <span>{GlobalStrings.get("dashboard", "required")}</span> }
            <span className="text-error">{error}</span>
        </div>
    );
});

interface InputListProps extends InputProps, InputElement {}

Input.List = React.forwardRef<HTMLInputElement, InputListProps>((
    { defaultValue, value, required, disabled, onChange, name, id }, ref?: React.LegacyRef<HTMLInputElement>
) => {
    const [error, setError] = useState('');
    const [input, setInput] = useState("");

    useEffect(() => {
        setInput(value ?? defaultValue ?? "");
    }, [value, defaultValue]);

    function handleOnChange(val: string) {
        setInput(val);
        if (onChange) onChange({[name ?? ""]: val});
    }

    return (
        <div className="flex flex-col space-y-2 flex-[2]">
            <input
                ref={ref}
                onChange={(event) => handleOnChange(event.target.value)} 
                value={input}
                placeholder={GlobalStrings.get("dashboard", "initInputList")}
                type='text'
                id={id}
                maxLength={2000}
                autoComplete="off"
                required={required}
                disabled={disabled ?? false}
                className={`${disabled && "hover:cursor-not-allowed"}`}
                name={name}
                style={{ borderWidth: '1px', borderRadius: '3px', borderColor: 'neutral', padding: '3px' }}
            />
            {required && <span>{GlobalStrings.get("dashboard", "required")}</span>}
            <span className="text-error">{error}</span>
        </div>
    );
});