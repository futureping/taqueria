import {TaskHandler, Action, Scaffold, Hook, Sandbox as theSandbox, Network, Attributes as theAttributes, RuntimeDependency, Task, UnvalidatedSandbox, UnvalidatedHook, UnvalidatedOption, UnvalidatedScaffold, UnvalidatedNetwork, EconomicalProtocol as theProtocol, UnvalidatedPositionalArg, OptionType, Environment as anEnvironment, SandboxConfig as theSandboxConfig, NetworkConfig as theNetworkConfig, EnvironmentConfig} from 'taqueria-protocol/taqueria-protocol-types'

export type Sandbox = theSandbox

export type Attributes = theAttributes

export type EconomicalProtocol = theProtocol

export type NetworkConfig = theNetworkConfig

export type SandboxConfig = theSandboxConfig

export interface TaskView {
    readonly task: string
    readonly command: string
    readonly description: string
    readonly aliases: string[]
    readonly options: UnvalidatedOption[]
    readonly positionals: UnvalidatedPositionalArg[]
    readonly handler: "proxy" | string | string[]
}

export interface PositionalArgView {
    readonly placeholder: string
    readonly description: string
    readonly type?: OptionType
    readonly defaultValue?: number | boolean | string
}

export interface Failure<Params> {
    readonly errorCode: string,
    readonly errorMsg: string,
    readonly context: Params
}

export type LikeAPromise<Success, Failure> = Promise<Success>

export type PositiveInt = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15

export type i18nMessage = string | {message: string, numOfArguments: PositiveInt}

export interface i18n {
    [key: string]: i18nMessage,
    readonly actionNotSupported: string,
    readonly proxyNotSupported: string
}

export interface RuntimeDependencyReport extends RuntimeDependency {
    readonly met: boolean
}

export interface CheckRuntimeDependenciesAction {
    readonly status: ActionResponseCode,
    readonly report: RuntimeDependencyReport[]
}

export interface InstallRuntimeDependenciesAction {
    readonly status: ActionResponseCode,
    readonly report: RuntimeDependencyReport[]
}

export type ActionResponseCode = "success" | "failed" | "notSupported"

export type ActionNotSupported = {
    readonly status: "notSupported",
    readonly msg: string
}

export interface ProxyAction {
    readonly status: ActionResponseCode,
    readonly stdout: string | unknown,
    readonly stderr: string,
    readonly render?: 'none' | 'string' | 'table'
}

export interface ActionPluginInfo extends SchemaView {
    readonly status: ActionResponseCode,
}

export type ActionResponse = ProxyAction | CheckRuntimeDependenciesAction | InstallRuntimeDependenciesAction | ActionPluginInfo | ActionNotSupported

export interface Schema {
    // This should match the PluginInfo, but tasks, scaffolds, hooks, networks, and sandboxes are optional
    readonly name: string
    readonly schema: string
    readonly version: string
    readonly tasks?: (Task | undefined)[]
    readonly scaffolds?: (Scaffold | undefined)[]
    readonly hooks?: (Hook | undefined)[]
    readonly networks?: (Network | undefined)[]
    readonly sandboxes?: (Sandbox | undefined)[]
    checkRuntimeDependencies?: <T>(i18n: i18n, parsedArgs: SanitizedArgs) => LikeAPromise<ActionResponse, Failure<T>>
    installRuntimeDependencies?: <T>(i18n: i18n, parsedargs: SanitizedArgs) => LikeAPromise<ActionResponse, Failure<T>>
    proxy?: <T>(parsedArgs: SanitizedArgs) => LikeAPromise<ActionResponse, Failure<T>>
}

export interface SchemaView {
    readonly name: string
    readonly schema: string
    readonly version: string
    readonly tasks: TaskView[]
    readonly scaffolds: UnvalidatedScaffold[]
    readonly hooks: UnvalidatedHook[]
    readonly networks: UnvalidatedNetwork[]
    readonly sandboxes: UnvalidatedSandbox[],
    checkRuntimeDependencies?: <T>(i18n: i18n, parsedArgs: SanitizedArgs) => LikeAPromise<ActionResponse, Failure<T>>
    installRuntimeDependencies?: <T>(i18n: i18n, parsedargs: SanitizedArgs) => LikeAPromise<ActionResponse, Failure<T>>
    proxy?: <T>(parsedArgs: SanitizedArgs) => LikeAPromise<ActionResponse, Failure<T>>
}

export type Args = string[]

export interface ParsedArgs {
    i18n: i18n
    taqRun: Action
    config: string
    projectDir: string
    configDir: string
    artifactsDir: string
}

export interface Config extends Record<string, unknown>{
    testsDir: string
    contractsDir: string
    artifactsDir: string
    sandbox: Record<string, SandboxConfig>
    network: Record<string, NetworkConfig>
    environment: Record<string, EnvironmentConfig> & {default: string}
}

export interface SanitizedArgs {
    [key: string]: unknown
    i18n: i18n
    taqRun: Action
    config: Config
    projectDir: string
    configDir: string
    contractsDir: string
    testsDir: string
    artifactsDir: string
    task?: string
}

export type pluginDefiner = (i18n: i18n) => Schema