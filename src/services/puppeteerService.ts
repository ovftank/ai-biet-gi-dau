import puppeteer, { Browser, Page } from 'puppeteer';

class PuppeteerService {
    private browser: Browser | null = null;
    private page: Page | null = null;

    constructor(
        private readonly enableImages: boolean,
        private readonly enableCss: boolean,
    ) {}
    async initBrowser(): Promise<void> {
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: this.getBrowserArgs(),
        });
        const pages = await this.browser.pages();
        this.page = pages[0];
        await this.setupRequestInterception();
    }

    private getBrowserArgs(): string[] {
        const args = [
            '--disable-web-security',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-notifications',
            '--disable-infobars',
            '--no-default-browser-check',
            '--mute-audio',
            '--disable-sync',
            '--no-first-run',
            '--disable-speech-api',
        ];

        if (!this.enableImages) {
            args.push('--blink-settings=imagesEnabled=false');
        }

        return args;
    }

    private async setupRequestInterception(): Promise<void> {
        if (!this.page) throw new Error('Page not initialized');
        await this.page.setRequestInterception(true);
        this.page.on('request', (req) => {
            if (!this.enableCss && req.resourceType() === 'stylesheet') {
                void req.abort();
            } else if (!this.enableImages && req.resourceType() === 'image') {
                void req.abort();
            } else {
                void req.continue();
            }
        });
    }

    getPage(): Page | null {
        return this.page;
    }

    async getCookies() {
        if (!this.page) throw new Error('Page not initialized');

        const rawCookies = (await this.page.cookies()).map(
            (cookie): Record<string, string> => ({
                domain: cookie.domain,
                name: cookie.name,
                path: cookie.path,
                value: cookie.value,
            }),
        );
        return JSON.stringify(rawCookies);
    }
    async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
        }
    }
}
export default PuppeteerService;
