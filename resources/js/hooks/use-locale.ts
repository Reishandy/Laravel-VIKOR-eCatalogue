import { useMemo } from 'react';
import localeCodes from 'locale-codes';

export function useAvailableLocales() {
    return useMemo(() => {
        return localeCodes.all
            .map((locale) => ({
                code: locale.tag,
                name: getLocaleDisplayName(locale.tag),
                nativeName: locale.name,
                location: locale.location,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, []);
}

export function useLocaleOptions() {
    const locales = useAvailableLocales();

    return useMemo(
        () =>
            locales.map((locale) => ({
                label: locale.name,
                value: locale.code,
            })),
        [locales],
    );
}

export function useCommonLocaleOptions() {
    return useMemo(() => {
        const commonCodes = [
            'en-US',
            'en-GB',
            'es-ES',
            'fr-FR',
            'de-DE',
            'it-IT',
            'pt-BR',
            'ja-JP',
            'ko-KR',
            'zh-CN',
            'zh-TW',
            'ru-RU',
            'ar-SA',
            'hi-IN',
            'id-ID',
            'th-TH',
            'vi-VN',
            'tr-TR',
        ];

        return commonCodes
            .map((code) => {
                const locale = localeCodes.getByTag(code);
                if (!locale) return null;
                return {
                    label: getLocaleDisplayName(code),
                    value: code,
                };
            })
            .filter(Boolean);
    }, []);
}

function getLocaleDisplayName(localeTag: string): string {
    try {
        const [language, region] = localeTag.split('-');

        const languageName = new Intl.DisplayNames([localeTag], {
            type: 'language',
            languageDisplay: 'standard',
        }).of(language);

        if (region) {
            const regionName = new Intl.DisplayNames([localeTag], {
                type: 'region',
            }).of(region);

            return `${languageName} (${regionName})`;
        }

        return languageName || localeTag;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        const locale = localeCodes.getByTag(localeTag);
        if (locale && locale.location) {
            return `${locale.name} (${locale.location})`;
        }
        return localeTag;
    }
}
