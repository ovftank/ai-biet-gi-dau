import PuppeteerService from './puppeteerService.js';
interface AuthResult {
    status: 'OK' | 'SAIPASS' | '2FA' | '681' | 'NO_PAGE';
}
interface TwoFACheckResult {
    text: 'Text message' | 'WhatsApp' | 'Authentication app';
}

class AuthService extends PuppeteerService {
    constructor() {
        super(true, true);
    }

    async checkAuth(username: string, password: string): Promise<AuthResult> {
        console.log('Checking auth');
        const page = this.getPage();
        if (!page) {
            return { status: 'NO_PAGE' };
        }
        await page.goto('https://en-gb.facebook.com/login');

        await page.type('#email', username);
        await page.type('#pass', password);
        await Promise.all([
            page.waitForNavigation(),
            page.click('#loginbutton'),
        ]);

        if (page.url().includes('/login/') || page.url().includes('recover')) {
            return { status: 'SAIPASS' };
        } else if (
            page.url().includes('two_step_verification') ||
            page.url().includes('681')
        ) {
            if (page.url().includes('two_step_verification')) {
                const tryAnotherWayButton = page.locator(
                    '::-p-text("Try Another Way")',
                );
                await tryAnotherWayButton?.click();
                const result: TwoFACheckResult = {
                    text: 'Authentication app',
                };
                const checkbox = page.locator(`::-p-text("${result.text}")`);
                await checkbox?.click();
                const continueButton = page.locator('::-p-text("Continue")');
                await continueButton?.click();
                return { status: '2FA' };
            } else {
                return { status: '681' };
            }
        }
        return { status: 'OK' };
    }

    async enter2FACode(code: string): Promise<void> {
        const page = this.getPage();
        if (!page) {
            return;
        }
        await page.type('input', code);
        const continueButton = page.locator('::-p-text("Continue")');
        await continueButton?.click();
    }
}

export default AuthService;
