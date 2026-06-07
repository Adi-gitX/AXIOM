import { L as Language } from './runtime-types-2qM0MukN.js';

/**
 * AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.
 *
 * Sources: runtime worker constants, package manifests, vendored runtime metadata.
 * Generator: scripts/generate-runtime-language-info.ts
 */

declare const LANGUAGE_RUNTIME_INFOS: Record<Language, LanguageRuntimeInfo>;

interface RuntimeComponentInfo {
    name: string;
    version?: string;
    label?: string;
    detail?: string;
}
interface RuntimeLibraryInfo {
    name: string;
    version?: string;
    importName?: string;
    globalName?: string;
    detail?: string;
}
interface LanguageRuntimeInfo {
    language: Language;
    displayName: string;
    versionLabel: string;
    description: string;
    runtime: RuntimeComponentInfo;
    compiler?: RuntimeComponentInfo;
    engine?: RuntimeComponentInfo;
    standard?: string;
    defaultImports?: readonly string[];
    libraries?: readonly RuntimeLibraryInfo[];
    notes?: readonly string[];
}

declare const SUPPORTED_LANGUAGE_RUNTIME_INFOS: readonly LanguageRuntimeInfo[];
declare function getLanguageRuntimeInfo(language: Language): LanguageRuntimeInfo;
declare function getSupportedLanguageRuntimeInfos(): readonly LanguageRuntimeInfo[];

export { LANGUAGE_RUNTIME_INFOS as L, type RuntimeComponentInfo as R, SUPPORTED_LANGUAGE_RUNTIME_INFOS as S, type LanguageRuntimeInfo as a, type RuntimeLibraryInfo as b, getSupportedLanguageRuntimeInfos as c, getLanguageRuntimeInfo as g };
