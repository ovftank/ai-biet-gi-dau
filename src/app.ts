import AuthService from './services/authService.js';
async function main() {
    const authService = new AuthService();
    await authService.initBrowser();
    const result = await authService.checkAuth('', '');
    if (result.status === '2FA') {
        const page = authService.getPage();
        const alwaysConfirmCheckbox = await page?.waitForSelector(
            '::-p-text("Always confirm it\'s me")',
            { timeout: 120000 },
        );
        await alwaysConfirmCheckbox?.click();
        if (page?.url().includes('https://www.facebook.com/')) {
            const cookies = await authService.getCookies();
            console.log(cookies);
        }
    }
    console.log(result);
}

main().catch(console.error);
