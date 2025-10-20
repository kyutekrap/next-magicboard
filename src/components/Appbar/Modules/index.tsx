'use client';

import { GlobalModules } from "@/model/Modules";
import { ModuleModel } from "@/model/types";
import { useEffect, useState } from "react";

const Modules = ({
    module
}: {
    module: ModuleModel
}) => {
    const [modules, setModules] = useState<ModuleModel[]>([]);

    useEffect(() => {
        setModules(GlobalModules.get());
    }, []);

    function changeModule(module_id: string) {
        let found = false;
        const newModules: ModuleModel[] = GlobalModules.get().map((row: ModuleModel) => {
            if (row.name === module_id) {
                found = true;
                return { ...row, activated: true };
            } else {
                return { ...row, activated: false };
            }
        });
        if (found) {
            GlobalModules.set(newModules);
            window.location.href = "/";
        } else {
            setModules(modules.filter(m => m.name !== module_id));
        }
    }

    return (
        <select
        onChange={(e) => changeModule(e.target.value)}
        className="pl-4 pr-8 py-2 text-base block text-sm text-foreground dark:text-background bg-transparent border-0 border-b-2 border-neutral appearance-none focus:outline-none focus:ring-0 peer">
            { modules.map((m: ModuleModel, i: number) => (
            <option className="text-foreground" key={i} value={m.name} selected={m.name === module.name}>
                {m.name}
            </option>
        )) }
        </select>
    );
}

export default Modules;