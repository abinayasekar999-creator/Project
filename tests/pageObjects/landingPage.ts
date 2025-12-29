import { expect, Locator, Page } from 'playwright/test';

export class LandingPage {
    Page: Page;
    private baseUrl = 'https://demowebshop.tricentis.com/';
    private homePageLogo: Locator;
    private searchBox: Locator;
    private searchButton: Locator;
    private addToCartButton: Locator;
    private gotoCartLink: Locator;
    private shoppingCartHeading: Locator;
    private cartTable: Locator;
    private subtotalPrice: Locator;
    private totalPrice: Locator;
    private termAndServiceCheckbox: Locator;
    private checkoutButton: Locator;
    private checkoutAsGuestButton: Locator;

    constructor(Page: Page) {
        this.Page = Page;
        this.homePageLogo = Page.getByRole('link', { name: 'Tricentis Demo Web Shop' });
        this.searchBox = Page.locator('input[value="Search store"]');
        this.searchButton = Page.locator('input[value="Search"]');
        this.addToCartButton = Page.locator('input[value="Add to cart"]').first();
        this.gotoCartLink = Page.locator('//span[text()="Shopping cart"]');
        this.shoppingCartHeading = Page.getByRole('heading', { name: 'Shopping cart' });
        this.cartTable = Page.locator('//table[@class="cart"]//tbody');
        this.subtotalPrice = Page.locator('td[class="cart-total-right"]').first();
        this.totalPrice = Page.locator('td[class="cart-total-right"]').last();
        this.termAndServiceCheckbox = Page.locator('#termsofservice');
        this.checkoutButton = Page.getByRole('button', { name: 'Checkout' });
        this.checkoutAsGuestButton = Page.getByRole('button', { name: 'Checkout as Guest' });
    }

    async navigateToWebShop(): Promise<void> {
        await this.Page.goto(this.baseUrl);
        await this.homePageLogo.waitFor({ state: 'visible' });
    }

    async addItemToCart(itemName: string): Promise<void> {
        await this.searchBox.fill(itemName);
        await this.searchButton.click();
        await this.Page.getByRole('link', { name: itemName, exact: true }).click();
        await this.addToCartButton.click();
        await expect(await this.Page.getByText('The product has been added to')).toBeVisible();
        console.log(`Added ${itemName} to the cart.`);
    }

    async gotoCart(): Promise<void> {
        await this.gotoCartLink.click();
        await this.shoppingCartHeading.waitFor({ state: 'visible' });
    }

    async priceCalculation() {
        let grandTotal = 0;
        for (let i = 0; i < await this.cartTable.locator('tr').count(); i++) {
            let priceText: any = await this.cartTable.locator('tr').nth(i).locator('td').nth(3).locator('[class="product-unit-price"]').textContent();
            let qty: any = await this.cartTable.locator('tr').nth(i).locator('td').nth(4).locator('input').inputValue();
            let expTotalPrice = +priceText * +qty;
            let acttotal = await this.cartTable.locator('tr').nth(i).locator('td').nth(5).locator('[class="product-subtotal"]').textContent();
            await expect(acttotal).toContain(expTotalPrice.toString());
            grandTotal += expTotalPrice;
        }
        console.log(`Grand Total Price of Added Products: ${grandTotal}`);
        await expect(await this.subtotalPrice).toContainText(grandTotal.toString());
        await expect(await this.totalPrice).toContainText(grandTotal.toString());

        return grandTotal.toString();
    }

    async checkout(): Promise<void> {
        await this.termAndServiceCheckbox.check();
        await this.checkoutButton.click();
        await this.checkoutAsGuestButton.click();
    }

}