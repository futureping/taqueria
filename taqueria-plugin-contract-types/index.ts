import {Plugin, Task, Option} from '@taqueria/node-sdk'
import type { i18n} from '@taqueria/node-sdk/types'
import {tasks} from './tasks'

Plugin.create((i18n: i18n) => ({
    alias: "contract-types",
    schema: "1.0",
    version: "0.1",
    tasks: [
        Task.create({
            task: "types",
            command: "types [contract]",
            description: "Generate types for a contract to be used with taquito",
            options: [
                Option.create({
                    flag: "typescriptDir",
                    description: "The output directory for the generated type files",
                    defaultValue: 'types',
                }),
                Option.create({
                    shortFlag: "t",
                    flag: "typeAliasMode",
                    choices: ['file', 'simple'],
                    description: "The type aliases used in the generated types"
                }),
            ],
            aliases: ["types"],
            handler: "proxy"
        }),
    ],
    proxy: tasks.generateTypes,
}), process.argv)