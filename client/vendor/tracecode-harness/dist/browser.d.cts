import { L as Language, d as RuntimeClient, b as LanguageRuntimeProfile, e as RuntimeExecutionStyle } from './runtime-types-2qM0MukN.cjs';
import { a as LanguageRuntimeInfo } from './runtime-language-info-Bxza1cI2.cjs';
export { L as LANGUAGE_RUNTIME_INFOS, R as RuntimeComponentInfo, b as RuntimeLibraryInfo, S as SUPPORTED_LANGUAGE_RUNTIME_INFOS, g as getLanguageRuntimeInfo, c as getSupportedLanguageRuntimeInfos } from './runtime-language-info-Bxza1cI2.cjs';

interface BrowserHarnessAssets {
    pythonWorker: string;
    pythonRuntimeCore: string;
    pythonSnippets: string;
    javascriptWorker: string;
    javaWorker: string;
    csharpWorker: string;
    csharpAssetBaseUrl: string;
    typescriptCompiler: string;
    cppWorker: string;
    cppCompilerFrame: string;
    cppCompilerWorker: string;
    cppClangWasm: string;
    cppLldWasm: string;
    cppSysroot: string;
    cppRuntimeHeader: string;
    cppCompilerBundle: string;
}
type BrowserHarnessAssetOverrides = Partial<BrowserHarnessAssets>;
declare const DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS: Readonly<BrowserHarnessAssets>;
declare function resolveBrowserHarnessAssets(options?: {
    assetBaseUrl?: string;
    assets?: BrowserHarnessAssetOverrides;
}): BrowserHarnessAssets;

interface CreateBrowserHarnessOptions {
    assetBaseUrl?: string;
    assets?: BrowserHarnessAssetOverrides;
    debug?: boolean;
    java?: {
        workerIdleTimeoutMs?: number;
    };
    csharp?: {
        workerIdleTimeoutMs?: number;
    };
    cpp?: {
        initTimeoutMs?: number;
        executionTimeoutMs?: number;
        tracingTimeoutMs?: number;
        interviewTimeoutMs?: number;
        workerIdleTimeoutMs?: number;
    };
}
interface BrowserHarness {
    readonly assets: BrowserHarnessAssets;
    readonly supportedLanguages: readonly Language[];
    getClient(language: Language): RuntimeClient;
    getProfile(language: Language): LanguageRuntimeProfile;
    getSupportedLanguageProfiles(): readonly LanguageRuntimeProfile[];
    getLanguageInfo(language: Language): LanguageRuntimeInfo;
    getSupportedLanguageInfos(): readonly LanguageRuntimeInfo[];
    isLanguageSupported(language: Language): boolean;
    warmLanguage(language: Language): Promise<{
        success: boolean;
        loadTimeMs: number;
    }>;
    disposeLanguage(language: Language): void;
    dispose(): void;
}
declare function createBrowserHarness(options?: CreateBrowserHarnessOptions): BrowserHarness;

type RuntimeRequestKind = 'execute' | 'trace' | 'interview';
interface RuntimeRequestSupportOptions {
    request: RuntimeRequestKind;
    executionStyle: RuntimeExecutionStyle;
    functionName?: string | null;
}
declare function assertRuntimeRequestSupported(profile: LanguageRuntimeProfile, options: RuntimeRequestSupportOptions): void;

declare const LANGUAGE_RUNTIME_PROFILES: Record<Language, LanguageRuntimeProfile>;
declare const SUPPORTED_LANGUAGES: readonly Language[];
declare function getLanguageRuntimeProfile(language: Language): LanguageRuntimeProfile;
declare function getSupportedLanguageProfiles(): readonly LanguageRuntimeProfile[];
declare function isLanguageSupported(language: Language): boolean;

export { type BrowserHarness, type BrowserHarnessAssetOverrides, type BrowserHarnessAssets, type CreateBrowserHarnessOptions, DEFAULT_BROWSER_HARNESS_ASSET_RELATIVE_PATHS, LANGUAGE_RUNTIME_PROFILES, LanguageRuntimeInfo, SUPPORTED_LANGUAGES, assertRuntimeRequestSupported, createBrowserHarness, getLanguageRuntimeProfile, getSupportedLanguageProfiles, isLanguageSupported, resolveBrowserHarnessAssets };
